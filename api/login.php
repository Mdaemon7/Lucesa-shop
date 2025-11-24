<?php
header('Content-Type: application/json; charset=utf-8');

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

$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success'=>false, 'message'=>'Correo y contraseña son obligatorios.']);
    exit;
}

$stmt = $pdo->prepare('SELECT id, name, email, password FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(['success'=>false, 'message'=>'Credenciales inválidas.']);
    exit;
}

echo json_encode([
    'success'=>true,
    'message'=>'Inicio de sesión exitoso.',
    'user'=>[
        'id'=>$user['id'],
        'name'=>$user['name'],
        'email'=>$user['email']
    ]
]);
