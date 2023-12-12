<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') { 
    if (!empty($_POST['message'])) {
        $ms = $_POST['message'];
        $url = 'https://api.futureforge.dev/image/openjourneyv4?text='.$ms;
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, []);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        if (curl_errno($ch)) {
            echo "error";
        } else {
            echo $response; 
        }
        curl_close($ch);
    } else {
        echo "error";
    }  
} else {
    echo "error";
}
?>