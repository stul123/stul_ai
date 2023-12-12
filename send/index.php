<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') { 
    $url = 'https://api.futureforge.dev/chatgpt-turbo/chat';
    if (!empty($_POST['message']) && !empty($_POST['chatid'])) {
        $ms = $_POST['message'];
        $chatid = $_POST['chatid'];
        $data = array(
            'message' => $ms,
            'chatCode' => $chatid,
        );
        $jsonData = json_encode($data);
        $options = array(
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $jsonData,
            CURLOPT_HTTPHEADER     => array(
                'Content-Type: application/json',
            ),
        );
        $ch = curl_init();
        curl_setopt_array($ch, $options);
        $response = curl_exec($ch);
        curl_close($ch);
        echo $response;
    } else {
        echo "error";
    }  
} else {
    echo "error";
}
?>
