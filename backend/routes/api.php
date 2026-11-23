<?php

use App\Http\Controllers\Api\UserCollectionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MediaController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('media', MediaController::class)
    ->parameters(['media' => 'media']);

Route::post('/users/{user}/collection/{media}', [UserCollectionController::class, 'addMedia']);

Route::delete('/users/{user}/collection/{media}', [UserCollectionController::class, 'removeMedia']);

Route::get('/users/{user}/collection', [UserCollectionController::class, 'showCollection']);
