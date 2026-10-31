<?php

// File: app/Http/Requests/ProductRequest.php
// Penjelasan: Validasi untuk request CRUD produk

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
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

            'category' => [
                $isCreate ? 'required' : 'sometimes',
                'string',
                Rule::in([
                    'alat pancing', 'Alat Pancing',
                    'budidaya', 'Budidaya',
                    'pakan', 'Pakan',
                    'akuarium', 'Akuarium',
                    'biota hidup', 'Biota Hidup',
                    'tanaman laut', 'Tanaman Laut',
                    'hasil laut', 'Hasil Laut',
                    'kuliner laut', 'Kuliner Laut',
                    'lainnya', 'Lainnya',
                ]),
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
                'string',
                'max:500',
                'regex:/^(https?:\/\/|\/)[^\s]+$/i',
            ],

            'image' => [
                'nullable',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
                'dimensions:max_width=6000,max_height=6000',
            ],

            'is_active' => [
                'sometimes',
                'boolean',
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
            'category.required' => 'Kategori produk wajib dipilih',
            'category.in' => 'Kategori produk tidak valid',

            'price.required' => 'Harga produk wajib diisi',
            'price.integer' => 'Harga harus berupa angka bulat',
            'price.min' => 'Harga minimal Rp 100',
            'price.max' => 'Harga maksimal Rp 1.000.000.000',

            'stock.required' => 'Stok produk wajib diisi',
            'stock.integer' => 'Stok harus berupa angka bulat',
            'stock.min' => 'Stok minimal 0',
            'stock.max' => 'Stok maksimal 999.999',

            'image_url.regex' => 'URL gambar harus berupa tautan http(s) atau path lokal yang diawali garis miring',
            'image.file' => 'Gambar produk harus berupa file',
            'image.image' => 'File harus berupa gambar yang valid',
            'image.mimes' => 'Format gambar harus JPG, PNG, atau WebP',
            'image.max' => 'Ukuran gambar maksimal 2 MB',
            'image.dimensions' => 'Resolusi gambar maksimal 6000 x 6000 piksel',
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
            if (preg_match('/^(?:Rp\s*)?(?:\d{1,3}(?:\.\d{3})+|\d+)$/', $this->price)) {
                $cleaned = preg_replace('/[^0-9]/', '', $this->price);
                $this->merge(['price' => $cleaned]);
            }
        }

        // Leave stock untouched: validation must reject decimals, arrays and text.

        if ($this->has('category') && is_string($this->category)) {
            $category = mb_strtolower(trim($this->category));
            $category = match ($category) {
                'alat_pancing' => 'alat pancing',
                'biota_hidup' => 'biota hidup',
                'tanaman_laut' => 'tanaman laut',
                'hasil_laut' => 'hasil laut',
                'kuliner_laut' => 'kuliner laut',
                default => $category,
            };
            $this->merge(['category' => $category]);
        }
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization()
    {
        if (! auth()->check()) {
            abort(401, 'Silakan login terlebih dahulu');
        }

        if (! auth()->user()->hasRole('seller')) {
            abort(403, 'Hanya pengguna dengan role Seller yang dapat mengelola produk');
        }

        if (! auth()->user()->store) {
            abort(400, 'Anda harus membuat toko terlebih dahulu');
        }
    }
}
