<?php

namespace App\Http\Controllers;

class LivreController extends Controller
{
    private array $livres = [
        1 => 'La lune',
        2 => 'Sabre',
        3 => 'Chevale',
    ];

    public function index()
    {
        return view('livres.index', ['livres' => $this->livres]);
    }

    public function show(int $id)
    {
        if (! isset($this->livres[$id])) {
            abort(404);
        }

        return view('livres.show', ['id' => $id, 'titre' => $this->livres[$id]]);
    }

    public function about()
    {
        return view('about');
    }
}
