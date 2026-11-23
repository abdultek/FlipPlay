<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255|unique:media,title',
            'type' => 'required|string|max:100',
            'genre' => 'required|string|max:100',
            'description' => 'nullable|string',
            'poster_url' => 'nullable|url|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul media wajib diisi.',
            'title.unique' => 'Judul media sudah tersedia.',
            'type.required' => 'Jenis media wajib diisi.',
            'genre.required' => 'Genre media wajib diisi.',
            'poster_url.url' => 'Poster harus berupa URL yang valid.',
        ];
    }
}
