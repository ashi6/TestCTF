<html>
<?php 
	if(isset($_COOKIE['admin']) && $_COOKIE['admin']==1)
	{
		echo "Welcome admin, the flag is flag{c00ki3z_are_delicious}";
	}
	else
	{
		echo "Only admins can read the flag";
		setcookie("admin", "0", time() + 100000, "/");
	}
?>
</html>
