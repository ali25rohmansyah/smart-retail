<?php
$loginQuery = "select * from siswa";
$check = $con->query($loginQuery);

// masukin data ke array
while($data = mysql_fetch_array($check)){
    $items[] = array(
        "id"=>$data['id'],
        "nama"=>$data['nama'],
        "kelas"=>$data['kelas']
    );
}

// Buat nampung data sama pesanya
$json = array(
    'pesan' => 'Data berhasil diambil',
    'data' => $items
);

// Ubah ke json
echo json_encode($json)
?>