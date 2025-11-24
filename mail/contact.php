<?php
header('Content-Type: application/json');

// Reemplaza con tu dirección de correo electrónico
$receiving_email_address = 'tu_correo@ejemplo.com';

if( file_exists($php_email_form = '../lib/php-mail-form/php-mail-form.php' )) {
    include( $php_email_form );
} else {
    die( 'Unable to load the "PHP Email Form" Library!');
}

$contact = new PHP_Email_Form;
$contact->ajax = true;

$contact->to = $receiving_email_address;
$contact->from_name = $_POST['name'];
$contact->from_email = $_POST['email'];
$contact->subject = $_POST['subject'];

// Descomenta el siguiente código si quieres usar un servidor SMTP para enviar los correos
//$contact->smtp = array(
//    'host' => 'example.com',
//    'username' => 'example',
//    'password' => 'pass',
//    'port' => '587'
//);

$contact->add_message( $_POST['name'], 'From');
$contact->add_message( $_POST['email'], 'Email');
$contact->add_message( $_POST['message'], 'Message', 10);

echo $contact->send();
?>