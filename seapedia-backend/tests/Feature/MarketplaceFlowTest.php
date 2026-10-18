<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Discount;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MarketplaceFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_submit_a_safe_application_review(): void
    {
        $payload = [
            'reviewer_name' => 'Nadia Pratama',
            'rating' => 5,
            'comment' => '<script>alert(1)</script> Navigasinya jelas dan mudah dipahami.',
        ];

        $this->postJson('/api/application-reviews', $payload)
            ->assertCreated()
            ->assertJsonPath('data.comment', $payload['comment']);

        $this->getJson('/api/application-reviews')
            ->assertOk()
            ->assertJsonPath('data.0.comment', $payload['comment']);

        $this->assertDatabaseHas('application_reviews', ['reviewer_name' => 'Nadia Pratama']);
    }

    public function test_private_domain_routes_require_the_matching_active_role(): void
    {
        $user = User::factory()->create();
        $user->roles()->create(['role' => 'buyer', 'is_active' => false]);
        $user->roles()->create(['role' => 'seller', 'is_active' => true]);
        Sanctum::actingAs($user);

        $this->getJson('/api/wallet')->assertForbidden();
        // Seller middleware passes; the controller then reports that no store exists yet.
        $this->getJson('/api/seller/products')->assertNotFound();
    }

    public function test_seller_can_update_store_without_changing_its_unique_name(): void
    {
        $seller = $this->userWithRole('seller');
        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Nama Toko Tetap',
            'description' => 'Deskripsi lama.',
            'address' => 'Jakarta',
            'phone' => '081200000010',
        ]);
        Sanctum::actingAs($seller);

        $this->putJson('/api/stores/my', [
            'name' => $store->name,
            'description' => 'Deskripsi baru.',
            'address' => $store->address,
            'phone' => $store->phone,
        ])->assertOk()
            ->assertJsonPath('data.name', 'Nama Toko Tetap')
            ->assertJsonPath('data.description', 'Deskripsi baru.');
    }

    public function test_seller_can_manage_product_category_and_soft_delete_product(): void
    {
        $seller = $this->userWithRole('seller');
        Store::create([
            'user_id' => $seller->id,
            'name' => 'Toko Kategori',
            'description' => 'Toko untuk menguji kategori.',
            'address' => 'Surabaya',
            'phone' => '081200000011',
        ]);
        Sanctum::actingAs($seller);

        $created = $this->postJson('/api/seller/products', [
            'name' => 'Lampu LED Reef',
            'description' => 'Lampu akuarium dengan pengaturan intensitas.',
            'category' => 'Akuarium',
            'price' => 175000,
            'stock' => 5,
        ])->assertCreated()
            ->assertJsonPath('data.category', 'akuarium');

        $productId = $created->json('data.id');

        $this->getJson('/api/products?category=Akuarium')
            ->assertOk()
            ->assertJsonPath('data.0.id', $productId);

        $this->deleteJson("/api/seller/products/{$productId}")->assertOk();
        $this->assertDatabaseHas('products', ['id' => $productId, 'is_active' => false]);
        $this->getJson("/api/products/{$productId}")->assertNotFound();
    }

    public function test_seller_can_upload_and_replace_a_product_image(): void
    {
        Storage::fake('public');
        config(['filesystems.product_images_disk' => 'public']);

        $seller = $this->userWithRole('seller');
        Store::create([
            'user_id' => $seller->id,
            'name' => 'Toko Foto Produk',
            'address' => 'Makassar',
            'phone' => '081200000099',
        ]);
        Sanctum::actingAs($seller);

        $created = $this->post('/api/seller/products', [
            'name' => 'Akuarium Laut Mini',
            'description' => 'Akuarium ringkas untuk aquascape laut.',
            'category' => 'akuarium',
            'price' => 450000,
            'stock' => 3,
            'image' => $this->fakeProductImage('akuarium.png'),
        ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJson(fn ($json) => $json
                ->where('success', true)
                ->whereType('data.image_url', 'string')
                ->missing('data.image_path')
                ->missing('data.image_disk')
                ->etc());

        $product = Product::findOrFail($created->json('data.id'));
        $firstPath = $product->getRawOriginal('image_path');
        Storage::disk('public')->assertExists($firstPath);

        $this->post("/api/seller/products/{$product->id}", [
            '_method' => 'PUT',
            'image' => $this->fakeProductImage('akuarium-baru.png'),
        ], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJson(fn ($json) => $json
                ->where('success', true)
                ->whereType('data.image_url', 'string')
                ->missing('data.image_path')
                ->missing('data.image_disk')
                ->etc());

        $product->refresh();
        $secondPath = $product->getRawOriginal('image_path');
        $this->assertNotSame($firstPath, $secondPath);
        Storage::disk('public')->assertMissing($firstPath);
        Storage::disk('public')->assertExists($secondPath);
    }

    public function test_product_upload_rejects_unsafe_or_oversized_files(): void
    {
        Storage::fake('public');
        config(['filesystems.product_images_disk' => 'public']);

        $seller = $this->userWithRole('seller');
        Store::create([
            'user_id' => $seller->id,
            'name' => 'Toko Validasi Foto',
            'address' => 'Manado',
            'phone' => '081200000098',
        ]);
        Sanctum::actingAs($seller);

        $this->post('/api/seller/products', [
            'name' => 'Produk Dengan File Tidak Aman',
            'category' => 'lainnya',
            'price' => 25000,
            'stock' => 1,
            'image' => UploadedFile::fake()->create('payload.svg', 50, 'image/svg+xml'),
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('image');

        $this->assertDatabaseMissing('products', ['name' => 'Produk Dengan File Tidak Aman']);

        $this->post('/api/seller/products', [
            'name' => 'Produk Dengan Foto Terlalu Besar',
            'category' => 'lainnya',
            'price' => 25000,
            'stock' => 1,
            'image' => $this->fakeOversizedProductImage(),
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonPath('errors.image.0', 'Ukuran gambar maksimal 2 MB');

        $this->assertDatabaseMissing('products', ['name' => 'Produk Dengan Foto Terlalu Besar']);
    }

    public function test_checkout_persists_delivery_discount_tax_and_status_history(): void
    {
        $seller = User::factory()->create();
        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Laut Tenang Goods',
            'description' => 'Produk rumah pilihan.',
            'address' => 'Bandung',
            'phone' => '081234567890',
        ]);
        $product = Product::create([
            'store_id' => $store->id,
            'name' => 'Lampu Akuarium',
            'description' => 'Lampu akuarium berwarna netral.',
            'category' => 'Akuarium',
            'price' => 100000,
            'stock' => 10,
        ]);

        $buyer = User::factory()->create();
        $buyer->roles()->create(['role' => 'buyer', 'is_active' => true]);
        Wallet::create(['user_id' => $buyer->id, 'balance' => 500000]);
        $address = Address::create([
            'user_id' => $buyer->id,
            'label' => 'Rumah',
            'recipient_name' => 'Ayu Larasati',
            'phone' => '081298765432',
            'full_address' => 'Jl. Melati 10, Jakarta',
            'is_default' => true,
        ]);
        $cart = Cart::create(['user_id' => $buyer->id]);
        CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 2]);
        Discount::create([
            'code' => 'HEMAT10',
            'name' => 'Hemat Sepuluh Persen',
            'type' => 'promo',
            'calculation_type' => 'percentage',
            'value' => 10,
            'minimum_purchase' => 100000,
            'maximum_discount' => 50000,
            'expires_at' => now()->addMonth(),
        ]);

        Sanctum::actingAs($buyer);

        $response = $this->postJson('/api/orders', [
            'address_id' => $address->id,
            'delivery_method' => 'regular',
            'discount_code' => 'HEMAT10',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.subtotal', '200000.00')
            ->assertJsonPath('data.discount_amount', '20000.00')
            ->assertJsonPath('data.delivery_fee', '10000.00')
            ->assertJsonPath('data.tax_amount', '21600.00')
            ->assertJsonPath('data.total_amount', '211600.00')
            ->assertJsonPath('data.status_histories.0.status', Order::STATUS_PACKAGING);

        $this->assertDatabaseHas('wallets', ['user_id' => $buyer->id, 'balance' => 288400]);
        $this->assertDatabaseHas('products', ['id' => $product->id, 'stock' => 8]);
        $this->assertDatabaseHas('discounts', ['code' => 'HEMAT10', 'used_count' => 1]);
    }

    public function test_new_buyer_order_is_connected_to_seller_and_driver_until_completed(): void
    {
        $seller = $this->userWithRole('seller');
        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Toko Integrasi Baru',
            'address' => 'Jakarta',
            'phone' => '081211111111',
        ]);
        $product = Product::create([
            'store_id' => $store->id,
            'name' => 'Produk Alur Lengkap',
            'category' => 'lainnya',
            'price' => 75000,
            'stock' => 4,
        ]);

        $this->postJson('/api/auth/register', [
            'name' => 'Pembeli Baru Integrasi',
            'email' => 'pembeli.baru@example.test',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertCreated();

        $login = $this->postJson('/api/auth/login', [
            'email' => 'pembeli.baru@example.test',
            'password' => 'password123',
        ])->assertOk()->assertJsonPath('user.active_role', 'buyer');
        $token = $login->json('token');

        $this->withToken($token)->postJson('/api/wallet/topup', ['amount' => 200000], [
            'Idempotency-Key' => 'new-buyer-topup',
        ])->assertOk();
        $address = $this->withToken($token)->postJson('/api/addresses', [
            'label' => 'Rumah',
            'recipient_name' => 'Pembeli Baru Integrasi',
            'phone' => '081222222222',
            'full_address' => 'Jl. Integrasi No. 17, Jakarta',
        ])->assertCreated();
        $this->withToken($token)->postJson('/api/cart/items', [
            'product_id' => $product->id,
            'quantity' => 1,
        ])->assertCreated();
        $checkout = $this->withToken($token)->postJson('/api/orders', [
            'address_id' => $address->json('data.id'),
            'delivery_method' => Order::DELIVERY_REGULAR,
        ], ['Idempotency-Key' => 'new-buyer-checkout'])->assertCreated();
        $orderId = $checkout->json('data.id');

        Sanctum::actingAs($seller);
        $this->getJson('/api/seller/orders')
            ->assertOk()
            ->assertJsonPath('data.0.id', $orderId);
        $this->putJson("/api/seller/orders/{$orderId}/status", ['status' => Order::STATUS_WAITING_SHIPPER])
            ->assertOk();

        $driver = $this->userWithRole('driver');
        Sanctum::actingAs($driver);
        $this->getJson('/api/driver/orders?status=waiting_shipper')
            ->assertOk()
            ->assertJsonPath('data.0.id', $orderId);
        $this->postJson("/api/driver/orders/{$orderId}/pickup")->assertOk();
        $this->postJson("/api/driver/orders/{$orderId}/complete")->assertOk();

        $buyer = User::where('email', 'pembeli.baru@example.test')->firstOrFail();
        Sanctum::actingAs($buyer);
        $this->getJson("/api/orders/{$orderId}")
            ->assertOk()
            ->assertJsonPath('data.status', Order::STATUS_COMPLETED)
            ->assertJsonPath('data.driver.id', $driver->id);
        $this->assertDatabaseHas('products', ['id' => $product->id, 'stock' => 3]);
    }

    public function test_money_mutations_are_idempotent(): void
    {
        $fixture = $this->createCartFixture();
        Sanctum::actingAs($fixture['buyer']);

        $headers = ['Idempotency-Key' => 'topup-once'];
        $this->postJson('/api/wallet/topup', ['amount' => 25000], $headers)->assertOk()->assertJsonPath('replayed', false);
        $this->postJson('/api/wallet/topup', ['amount' => 25000], $headers)->assertOk()->assertJsonPath('replayed', true);
        $this->assertDatabaseHas('wallets', ['user_id' => $fixture['buyer']->id, 'balance' => 525000]);

        $payload = [
            'address_id' => $fixture['address']->id,
            'delivery_method' => Order::DELIVERY_REGULAR,
        ];
        $checkoutHeaders = ['Idempotency-Key' => 'checkout-once'];
        $first = $this->postJson('/api/orders', $payload, $checkoutHeaders)->assertCreated()->assertJsonPath('replayed', false);
        $this->postJson('/api/orders', $payload, $checkoutHeaders)
            ->assertOk()
            ->assertJsonPath('replayed', true)
            ->assertJsonPath('data.id', $first->json('data.id'));

        $this->assertDatabaseCount('orders', 1);
        $this->assertDatabaseHas('wallets', ['user_id' => $fixture['buyer']->id, 'balance' => 403000]);
        $this->assertDatabaseHas('products', ['id' => $fixture['product']->id, 'stock' => 9]);
    }

    public function test_only_one_driver_can_claim_the_same_job(): void
    {
        $fixture = $this->createOrderFixture(Order::STATUS_WAITING_SHIPPER);
        $firstDriver = $this->userWithRole('driver');
        $secondDriver = $this->userWithRole('driver');

        Sanctum::actingAs($firstDriver);
        $this->postJson("/api/driver/orders/{$fixture['order']->id}/pickup")->assertOk();

        Sanctum::actingAs($secondDriver);
        $this->postJson("/api/driver/orders/{$fixture['order']->id}/pickup")
            ->assertStatus(409)
            ->assertJsonPath('message', 'Job sudah diambil atau tidak lagi tersedia.');

        $this->assertDatabaseHas('orders', [
            'id' => $fixture['order']->id,
            'driver_id' => $firstDriver->id,
            'status' => Order::STATUS_SHIPPING,
        ]);
    }

    public function test_buyer_cannot_read_or_cancel_another_buyers_order(): void
    {
        ['order' => $order] = $this->createOrderFixture();
        $intruder = $this->userWithRole('buyer');
        Sanctum::actingAs($intruder);

        $this->getJson("/api/orders/{$order->id}")->assertNotFound();
        $this->postJson("/api/orders/{$order->id}/cancel")->assertNotFound();
    }

    public function test_order_lifecycle_is_owned_by_seller_and_driver_and_records_history(): void
    {
        $fixture = $this->createOrderFixture();
        $order = $fixture['order'];

        Sanctum::actingAs($fixture['seller']);
        $this->putJson("/api/seller/orders/{$order->id}/status", ['status' => Order::STATUS_WAITING_SHIPPER])
            ->assertOk()
            ->assertJsonPath('data.status', Order::STATUS_WAITING_SHIPPER);

        $driver = $this->userWithRole('driver');
        Sanctum::actingAs($driver);
        $this->postJson("/api/driver/orders/{$order->id}/pickup")
            ->assertOk()
            ->assertJsonPath('data.status', Order::STATUS_SHIPPING);

        $otherDriver = $this->userWithRole('driver');
        Sanctum::actingAs($otherDriver);
        $this->postJson("/api/driver/orders/{$order->id}/complete")->assertStatus(409);

        Sanctum::actingAs($driver);
        $this->postJson("/api/driver/orders/{$order->id}/complete")
            ->assertOk()
            ->assertJsonPath('data.status', Order::STATUS_COMPLETED);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'driver_id' => $driver->id,
            'status' => Order::STATUS_COMPLETED,
        ]);
        $this->assertDatabaseCount('order_status_histories', 4);
    }

    public function test_driver_return_refunds_wallet_and_stock_only_once(): void
    {
        $fixture = $this->createOrderFixture(Order::STATUS_SHIPPING);
        $driver = $this->userWithRole('driver');
        $fixture['order']->update(['driver_id' => $driver->id]);
        Sanctum::actingAs($driver);

        $payload = ['reason' => 'Penerima tidak dapat ditemukan di alamat tujuan.'];
        $this->postJson("/api/driver/orders/{$fixture['order']->id}/return", $payload)
            ->assertOk()
            ->assertJsonPath('data.status', Order::STATUS_RETURNED);

        $this->postJson("/api/driver/orders/{$fixture['order']->id}/return", $payload)
            ->assertStatus(409);

        $this->assertDatabaseHas('wallets', ['user_id' => $fixture['buyer']->id, 'balance' => 150000]);
        $this->assertDatabaseHas('products', ['id' => $fixture['product']->id, 'stock' => 10]);
        $this->assertDatabaseCount('transactions', 1);
        $this->assertDatabaseCount('order_status_histories', 2);
    }

    public function test_invalid_discount_does_not_mutate_checkout_state(): void
    {
        $fixture = $this->createCartFixture();
        Sanctum::actingAs($fixture['buyer']);

        $this->postJson('/api/orders', [
            'address_id' => $fixture['address']->id,
            'delivery_method' => Order::DELIVERY_REGULAR,
            'discount_code' => 'TIDAKADA',
        ])->assertUnprocessable();

        $this->assertDatabaseHas('wallets', ['user_id' => $fixture['buyer']->id, 'balance' => 500000]);
        $this->assertDatabaseHas('products', ['id' => $fixture['product']->id, 'stock' => 10]);
        $this->assertDatabaseHas('cart_items', ['cart_id' => $fixture['cart']->id, 'product_id' => $fixture['product']->id]);
        $this->assertDatabaseCount('orders', 0);
    }

    public function test_cart_updates_by_cart_item_id_not_product_id(): void
    {
        $seller = $this->userWithRole('seller');
        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Toko Cart ID',
            'address' => 'Malang',
            'phone' => '081200000012',
        ]);
        Product::create([
            'store_id' => $store->id,
            'name' => 'Produk Pembeda ID',
            'category' => 'lainnya',
            'price' => 1000,
            'stock' => 1,
        ]);
        $targetProduct = Product::create([
            'store_id' => $store->id,
            'name' => 'Produk Target Cart',
            'category' => 'lainnya',
            'price' => 25000,
            'stock' => 10,
        ]);
        $buyer = $this->userWithRole('buyer');
        $cart = Cart::create(['user_id' => $buyer->id]);
        $cartItem = CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $targetProduct->id,
            'quantity' => 1,
        ]);
        $this->assertNotSame($cartItem->id, $targetProduct->id);
        Sanctum::actingAs($buyer);

        $this->putJson("/api/cart/items/{$cartItem->id}", ['quantity' => 3])
            ->assertOk()
            ->assertJsonPath('data.quantity', 3);

        $this->deleteJson("/api/cart/items/{$cartItem->id}")->assertOk();
        $this->assertDatabaseMissing('cart_items', ['id' => $cartItem->id]);
    }

    public function test_inactive_product_cannot_be_added_to_cart(): void
    {
        $seller = $this->userWithRole('seller');
        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Toko Produk Nonaktif',
            'address' => 'Solo',
            'phone' => '081200000013',
        ]);
        $product = Product::create([
            'store_id' => $store->id,
            'name' => 'Produk Tidak Dijual',
            'category' => 'lainnya',
            'price' => 50000,
            'stock' => 10,
            'is_active' => false,
        ]);
        $buyer = $this->userWithRole('buyer');
        Sanctum::actingAs($buyer);

        $this->postJson('/api/cart/items', ['product_id' => $product->id, 'quantity' => 1])
            ->assertStatus(409)
            ->assertJsonPath('message', 'Produk atau toko sedang tidak aktif.');
        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_admin_discount_codes_are_normalized_before_unique_validation(): void
    {
        $admin = $this->userWithRole('admin');
        Sanctum::actingAs($admin);
        $payload = [
            'code' => ' hemat-baru ',
            'name' => 'Promo Hemat Baru',
            'type' => 'promo',
            'calculation_type' => 'percentage',
            'value' => 10,
            'minimum_purchase' => 25000,
            'expires_at' => now()->addMonth()->toISOString(),
        ];

        $this->postJson('/api/admin/discounts', $payload)
            ->assertCreated()
            ->assertJsonPath('data.code', 'HEMAT-BARU');

        $this->postJson('/api/admin/discounts', [
            ...$payload,
            'code' => 'HEMAT-BARU',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('code');
    }

    public function test_admin_simulation_returns_overdue_order_and_searches_users(): void
    {
        $fixture = $this->createOrderFixture();
        $fixture['order']->timestamps = false;
        $fixture['order']->updated_at = now()->subDays(10);
        $fixture['order']->save();

        $admin = $this->userWithRole('admin', ['name' => 'Administrator Audit']);
        User::factory()->create(['name' => 'Target Pencarian Unik', 'email' => 'target@example.test']);
        Sanctum::actingAs($admin);

        $this->getJson('/api/admin/users?search=Target%20Pencarian%20Unik')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.email', 'target@example.test');

        $this->postJson('/api/admin/simulate-time', ['hours' => 1])
            ->assertOk()
            ->assertJsonCount(1, 'data.processed')
            ->assertJsonPath('data.processed.0.status', Order::STATUS_RETURNED);

        $this->assertDatabaseHas('wallets', ['user_id' => $fixture['buyer']->id, 'balance' => 150000]);
        $this->assertDatabaseHas('products', ['id' => $fixture['product']->id, 'stock' => 10]);
    }

    private function userWithRole(string $role, array $attributes = []): User
    {
        $user = User::factory()->create($attributes);
        $user->roles()->create(['role' => $role, 'is_active' => true]);

        return $user;
    }

    private function fakeProductImage(string $filename): UploadedFile
    {
        // Valid 1x1 PNG, independent of the optional GD extension in CI.
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', true);

        return UploadedFile::fake()->createWithContent($filename, $png);
    }

    private function fakeOversizedProductImage(): UploadedFile
    {
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', true);

        return UploadedFile::fake()->createWithContent('terlalu-besar.png', $png.str_repeat("\0", 2049 * 1024));
    }

    private function createOrderFixture(string $status = Order::STATUS_PACKAGING): array
    {
        $seller = $this->userWithRole('seller');
        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Toko Fixture',
            'description' => 'Toko untuk pengujian.',
            'address' => 'Jakarta',
            'phone' => '081200000001',
        ]);
        $product = Product::create([
            'store_id' => $store->id,
            'name' => 'Produk Fixture',
            'description' => 'Produk untuk pengujian lifecycle.',
            'category' => 'Budidaya',
            'price' => 100000,
            'stock' => 8,
        ]);
        $buyer = $this->userWithRole('buyer');
        Wallet::create(['user_id' => $buyer->id, 'balance' => 50000]);
        $order = Order::create([
            'user_id' => $buyer->id,
            'store_id' => $store->id,
            'status' => $status,
            'delivery_method' => Order::DELIVERY_REGULAR,
            'subtotal' => 100000,
            'discount_amount' => 0,
            'delivery_fee' => 10000,
            'tax_amount' => 12000,
            'total_amount' => 100000,
            'shipping_address' => "Pembeli Fixture\nJakarta\n081200000002",
        ]);
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'price_at_purchase' => 50000,
        ]);
        $order->recordStatus($buyer, 'Pesanan fixture dibuat.');

        return compact('buyer', 'seller', 'store', 'product', 'order');
    }

    private function createCartFixture(): array
    {
        $seller = $this->userWithRole('seller');
        $store = Store::create([
            'user_id' => $seller->id,
            'name' => 'Toko Cart Fixture',
            'description' => 'Toko checkout.',
            'address' => 'Bandung',
            'phone' => '081200000003',
        ]);
        $product = Product::create([
            'store_id' => $store->id,
            'name' => 'Produk Cart Fixture',
            'description' => 'Produk checkout.',
            'category' => 'Alat Pancing',
            'price' => 100000,
            'stock' => 10,
        ]);
        $buyer = $this->userWithRole('buyer');
        Wallet::create(['user_id' => $buyer->id, 'balance' => 500000]);
        $address = Address::create([
            'user_id' => $buyer->id,
            'label' => 'Rumah',
            'recipient_name' => 'Buyer Cart',
            'phone' => '081200000004',
            'full_address' => 'Jakarta',
            'is_default' => true,
        ]);
        $cart = Cart::create(['user_id' => $buyer->id]);
        CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 1]);

        return compact('buyer', 'seller', 'store', 'product', 'address', 'cart');
    }
}
