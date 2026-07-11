<?php
// File: app/Http/Requests/ProductRequest.php
// Penjelasan: Validasi untuk request CRUD produk

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // User harus seller dan punya toko
        return auth()->check()
            && auth()->user()->hasRole('seller')
            && auth()->user()->store;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        // Tentukan apakah ini create atau update
        $isCreate = $this->isMethod('post');

        return [
            'name' => [
                $isCreate ? 'required' : 'sometimes',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
                'max:2000',
            ],

            'price' => [
                $isCreate ? 'required' : 'sometimes',
                'integer',
                'min:100',
                'max:999999999',
            ],

            'stock' => [
                $isCreate ? 'required' : 'sometimes',
                'integer',
                'min:0',
                'max:999999',
            ],

            'image_url' => [
                'nullable',
                'url',
                'max:500',
            ],
        ];
    }

    /**
     * Custom error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk wajib diisi',
            'name.max' => 'Nama produk maksimal 255 karakter',

            'price.required' => 'Harga produk wajib diisi',
            'price.integer' => 'Harga harus berupa angka bulat',
            'price.min' => 'Harga minimal Rp 100',
            'price.max' => 'Harga maksimal Rp 1.000.000.000',

            'stock.required' => 'Stok produk wajib diisi',
            'stock.integer' => 'Stok harus berupa angka bulat',
            'stock.min' => 'Stok minimal 0',
            'stock.max' => 'Stok maksimal 999.999',

            'image_url.url' => 'URL gambar tidak valid',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Jika price ada dan berupa string dengan formatting
        if ($this->has('price') && is_string($this->price)) {
            // Hapus karakter non-numerik
            $cleaned = preg_replace('/[^0-9]/', '', $this->price);
            $this->merge(['price' => (int) $cleaned]);
        }

        // Pastikan stock adalah integer
        if ($this->has('stock')) {
            $this->merge(['stock' => (int) $this->stock]);
        }
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization()
    {
        if (!auth()->check()) {
            abort(401, 'Silakan login terlebih dahulu');
        }

        if (!auth()->user()->hasRole('seller')) {
            abort(403, 'Hanya pengguna dengan role Seller yang dapat mengelola produk');
        }

        if (!auth()->user()->store) {
            abort(400, 'Anda harus membuat toko terlebih dahulu');
        }
    }
}
