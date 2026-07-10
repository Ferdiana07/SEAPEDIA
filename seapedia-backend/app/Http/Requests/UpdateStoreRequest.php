<?php
// File: app/Http/Requests/UpdateStoreRequest.php

namespace App\Http\Requests;

class UpdateStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        // User harus login dan punya role seller
        return auth()->check() && auth()->user()->hasRole('seller');
    }
    
    public function rules(): array
    {
        // Ambil store_id dari route
        $storeId = $this->route('store');
        
        return [
            'name' => [
                'sometimes',            // opsional (tidak wajib ada di request)
                'string',
                'max:255',
                // ⭐ UNIK tapi exclude toko ini sendiri
                // Jika tidak exclude, validasi akan gagal karena nama toko ini
                // sudah ada di database
                Rule::unique('stores', 'name')->ignore($storeId),
            ],
            
            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
            
            'address' => [
                'sometimes',
                'string',
                'max:500',
            ],
            
            'phone' => [
                'sometimes',
                'string',
                'max:20',
            ],
            
            'image_url' => [
                'nullable',
                'url',
                'max:500',
            ],
        ];
    }
    
    public function messages(): array
    {
        return [
            'name.unique' => 'Nama toko sudah digunakan oleh toko lain',
            'image_url.url' => 'URL gambar tidak valid',
        ];
    }
}