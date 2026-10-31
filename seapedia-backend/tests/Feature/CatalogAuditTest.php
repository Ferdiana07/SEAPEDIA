<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CatalogAuditTest extends TestCase
{
    use RefreshDatabase;

    private function product(array $attributes = [], bool $activeStore = true): Product
    {
        $seller = User::factory()->create();
        $seller->roles()->create(['role' => 'seller', 'is_active' => true]);
        $store = Store::create([
            'user_id' => $seller->id, 'name' => 'Toko Bahari '.$seller->id,
            'address' => 'Jakarta', 'phone' => '081234567890', 'is_active' => $activeStore,
        ]);
        $store->forceFill(['is_active' => $activeStore])->save();

        return Product::create([
            'store_id' => $store->id, 'name' => 'Pelet Laut', 'description' => 'Pakan budidaya',
            'category' => 'pakan', 'price' => 50000, 'stock' => 10, ...$attributes,
        ]);
    }

    public function test_catalog_hides_inactive_stores_and_unpublished_products(): void
    {
        $visible = $this->product();
        $inactiveStore = $this->product([], false);
        $inactiveProduct = $this->product(['is_active' => false]);

        $this->getJson('/api/products')->assertOk()->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.id', $visible->id);
        foreach ([$inactiveStore, $inactiveProduct] as $product) {
            $this->getJson('/api/products/'.$product->id)->assertNotFound();
            $this->getJson('/api/products/'.$product->id.'/reviews')->assertNotFound();
        }
    }

    public function test_public_identity_does_not_expose_seller_email(): void
    {
        $product = $this->product();
        $this->getJson('/api/stores/'.$product->store_id)->assertOk()
            ->assertJsonMissingPath('data.user.email');
        $this->getJson('/api/products/'.$product->id)->assertOk()
            ->assertJsonPath('data.store.user.id', $product->store->user_id)
            ->assertJsonMissingPath('data.store.user.email');
    }

    public function test_catalog_searches_category_and_store_case_insensitively_and_honors_zero_maximum(): void
    {
        $product = $this->product(['name' => 'Nutrisi Harian', 'description' => 'Butiran nutrisi']);
        foreach (['PAKAN', strtoupper($product->store->name)] as $keyword) {
            $this->getJson('/api/products?search='.urlencode($keyword))->assertOk()
                ->assertJsonPath('meta.total', 1);
        }
        $this->getJson('/api/products?max_price=0')->assertOk()->assertJsonPath('meta.total', 0);
    }

    public function test_invalid_catalog_filters_return_validation_errors_instead_of_server_errors(): void
    {
        foreach (['search[]=x', 'category[]=x', 'min_price=-1', 'min_price=100&max_price=50', 'sort_by[]=price', 'page=0', 'per_page=10000'] as $query) {
            $this->getJson('/api/products?'.$query)->assertUnprocessable();
        }
    }

    public function test_pagination_is_stable_when_products_share_timestamps_and_prices(): void
    {
        $first = $this->product();
        $second = $this->product();
        Product::query()->update(['created_at' => '2026-10-01 00:00:00']);
        $this->getJson('/api/products?per_page=1')->assertOk()->assertJsonPath('data.0.id', $second->id);
        $this->getJson('/api/products?per_page=1&page=2')->assertOk()->assertJsonPath('data.0.id', $first->id);
    }

    public function test_product_validation_rejects_coercion_of_invalid_stock_and_price(): void
    {
        $product = $this->product();
        Sanctum::actingAs($product->store->user);
        foreach (['oops', '1.5', ['1']] as $stock) {
            $this->putJson('/api/seller/products/'.$product->id, ['stock' => $stock])
                ->assertUnprocessable()->assertJsonValidationErrors('stock');
        }
        foreach (['-100', 'Rp -1.000', '12abc34'] as $price) {
            $this->putJson('/api/seller/products/'.$product->id, ['price' => $price])
                ->assertUnprocessable()->assertJsonValidationErrors('price');
        }
        $this->assertSame(10, $product->fresh()->stock);
        $this->assertSame(50000, $product->fresh()->price);
    }

    public function test_login_rejects_malformed_email_and_limits_repeated_attempts(): void
    {
        $this->postJson('/api/auth/login', ['email' => ['x'], 'password' => 'invalid'])
            ->assertUnprocessable();
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/auth/login', ['email' => 'limit@example.test', 'password' => 'invalid'])
                ->assertUnauthorized();
        }
        $this->postJson('/api/auth/login', ['email' => 'limit@example.test', 'password' => 'invalid'])
            ->assertStatus(429)->assertHeader('Retry-After');
    }
}
