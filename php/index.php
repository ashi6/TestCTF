<!DOCTYPE html>
<html>
<head>
	<title>
		Forum Login
	</title>
</head>
<body>
	<?php 
if( isset($_POST['username']) ){
			$servername = "localhost";
			$username = "root";
			$password = "password";
			$dbname = "test";
			$conn = mysqli_connect($servername, $username, $password, $dbname);
			if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}
			$sql = "SELECT username, password FROM users WHERE username='".$_POST['username']."' AND password='".$_POST['password']."'";
			$result=mysqli_query($conn,$sql);
			$row=mysqli_fetch_row($result);
			if($row[0] === "admin"){
				echo "flag{sq1_inj3ct10n5_R_c001}";
			} elseif($row[0] === NULL){
				echo "invalid username and/or password";
			} else{
				echo "only the admin gets the flag";
			}
			echo "<br>";
		}
	?>
	<form method="POST">
		Username: <input type="text" name="username"> <br>
		Password: <input type="password" name="password"> <br>
		<input type="submit" name="submit">
	</form>
</body>
</html>
