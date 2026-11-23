<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Media;
use Illuminate\Http\Request;
use App\Http\Resources\MediaResource;

class UserCollectionController extends Controller
{
    public function addMedia(Request $request, User $user, Media $media)
    {
        if ($user->medias()->where('media_id', $media->id)->exists()) {
            return response()->json([
                'message' => 'Media sudah ada di koleksi pengguna.'
            ], 409);
        }

        $user->medias()->attach($media->id);

        return response()->json([
            'message' => 'Media berhasil ditambahkan ke koleksi.',
            'data' => new MediaResource($media),
        ], 201);
    }

    public function removeMedia(User $user, Media $media)
    {
        $user->medias()->detach($media->id);

        return response()->json([
            'message' => 'Media berhasil dihapus dari koleksi.'
        ]);
    }

    public function showCollection(User $user)
    {
        $medias = $user->medias()->with('users')->get();

        return MediaResource::collection($medias);
    }
}
