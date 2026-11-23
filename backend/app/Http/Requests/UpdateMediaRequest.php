<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $media = $this->route('media');
        $mediaId = $media instanceof \App\Models\Media
            ? $media->id
            : $media;

        return [
            'title' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('media', 'title')->ignore($mediaId),
            ],
            'type' => 'sometimes|required|string|max:100',
            'genre' => 'sometimes|required|string|max:100',
            'description' => 'sometimes|nullable|string',
            'poster_url' => 'sometimes|nullable|url|max:255',
        ];
    }
}
