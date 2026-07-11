<?php
// File: app/Http/Requests/CreateStoreRequest.php
// Penjelasan: Validasi untuk request pembuatan toko baru

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * 
     * Penjelasan:
     * Method ini menentukan apakah user boleh membuat toko.
     * Dipanggil SEBELUM validasi.
     * 
     * @return bool
     */
    public function authorize(): bool
    {
        // ✅ User harus login
        if (!auth()->check()) {
            return false;
        }
        
        // ✅ User harus punya role "seller"
        if (!auth()->user()->hasRole('seller')) {
            return false;
        }
        
        // ✅ User belum punya toko
        if (auth()->user()->store) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Get the validation rules that apply to the request.
     * 
     * Penjelasan:
     * Rules validasi untuk field-field yang diinput.
     * Jika ada yang violate, return 422 dengan pesan error.
     * 
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // Nama toko
            'name' => [
                'required',              // Wajib diisi
                'string',               // Harus teks
                'max:255',              // Maksimal 255 karakter
                'unique:stores,name',   // ⭐ UNIK: tidak boleh sama dengan toko lain
            ],
            
            // Deskripsi
            'description' => [
                'nullable',             // Boleh kosong (null)
                'string',               // Harus teks
                'max:1000',             // Maksimal 1000 karakter
            ],
            
            // Alamat
            'address' => [
                'required',             // Wajib diisi
                'string',               // Harus teks
                'max:500',              // Maksimal 500 karakter
            ],
            
            // Telepon
            'phone' => [
                'required',             // Wajib diisi
                'string',               // Harus teks
                'max:20',               // Maksimal 20 karakter
            ],
            
            // Gambar (optional)
            'logo_url' => [
                'nullable',             // Boleh kosong
                'url',                  // Harus valid URL
                'max:500',              // Maksimal 500 karakter
            ],
        ];
    }
    
    /**
     * Get custom messages for validator errors.
     * 
     * Penjelasan:
     * Pesan error kustom untuk setiap rule yang gagal.
     * Bahasa Indonesia untuk UX Indonesia.
     * 
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama toko wajib diisi',
            'name.unique' => 'Nama toko sudah digunakan oleh toko lain',
            'name.max' => 'Nama toko maksimal 255 karakter',
            
            'description.max' => 'Deskripsi maksimal 1000 karakter',
            
            'address.required' => 'Alamat toko wajib diisi',
            'address.max' => 'Alamat maksimal 500 karakter',
            
            'phone.required' => 'Nomor telepon wajib diisi',
            'phone.max' => 'Nomor telepon maksimal 20 karakter',
            
            'logo_url.url' => 'URL logo tidak valid',
        ];
    }
    
    /**
     * Handle a failed authorization attempt.
     * 
     * Penjelasan:
     * Dipanggil ketika authorize() return false.
     * Override untuk custom error response.
     */
    protected function failedAuthorization()
    {
        // Jika user belum punya role seller
        if (!auth()->user()->hasRole('seller')) {
            abort(403, 'Hanya pengguna dengan role Seller yang dapat membuat toko');
        }
        
        // Jika user sudah punya toko
        if (auth()->user()->store) {
            abort(400, 'Anda sudah memiliki toko. Setiap seller hanya boleh memiliki 1 toko.');
        }
        
        abort(401, 'Silakan login terlebih dahulu');
    }
}