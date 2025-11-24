<?php
header('Content-Type: application/json; charset=utf-8');

// Configuración de conexión (ajusta si cambias el nombre de la BD)
$host = '127.0.0.1';
$db   = 'lucesa_db';
$user = 'root';
$pass = 'lucesa20172019';
$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false, 'message'=>'Error al conectar con la base de datos.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) $input = $_POST;

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success'=>false, 'message'=>'Todos los campos son obligatorios.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success'=>false, 'message'=>'Formato de correo inválido.']);
    exit;
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['success'=>false, 'message'=>'El correo ya está registrado.']);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');

try {
    $stmt->execute([$name, $email, $hash]);
    http_response_code(201);
    echo json_encode(['success'=>true, 'message'=>'Usuario registrado correctamente.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success'=>false, 'message'=>'Error al registrar el usuario.']);
}
