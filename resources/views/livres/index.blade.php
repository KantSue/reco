<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Liste des livres</title>
</head>
<body>
    <a href="{{ route('about') }}">about</a>
    <h1>Liste des livres</h1>

    <ul>
        @foreach ($livres as $id => $titre)
            <li>
                <a href="{{ route('livres.show', $id) }}">{{ $titre }}</a>
            </li>
        @endforeach
    </ul>
</body>
</html>