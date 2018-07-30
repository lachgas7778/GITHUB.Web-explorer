<?php
if(isset($_GET["utility"])){
    $m = $_GET["utility"];
    if($m == "read"){
        $result = Array();
        $result1 = Array();
        $names = Array();
        $dir = new DirectoryIterator(dirname(__FILE__)."/uploads");
        foreach ($dir as $fileinfo) {
            /*if($fileinfo->getFilename() === "." or $fileinfo->getFilename() === ".." or $fileinfo->getFilename()[0] === "." or $fileinfo->getExtension() == "zip"){

            }else{
                $ex = explode("\n", file_get_contents("uploads/".$fileinfo->getFilename()));
                array_push($result1, $ex);
                array_push($names, $fileinfo->getFilename());
            }*/
            if($fileinfo->getFilename() === $_GET["id"]){
                if(strtolower($fileinfo->getExtension()) == "png" || strtolower($fileinfo->getExtension()) == "jpg" || strtolower($fileinfo->getExtension()) == "jpeg" || strtolower($fileinfo->getExtension()) == "bmp" || strtolower($fileinfo->getExtension()) == "gif"){
                    array_push($result1, false);
                    $result["reason"] = "img";
                }
                else if(strtolower($fileinfo->getExtension()) == "mp4" || strtolower($fileinfo->getExtension()) == "mts" || strtolower($fileinfo->getExtension()) == "avi" || strtolower($fileinfo->getExtension()) == "webm" || strtolower($fileinfo->getExtension()) == "mpeg4" || strtolower($fileinfo->getExtension()) == "mpeggs" || strtolower($fileinfo->getExtension()) == "flv" || strtolower($fileinfo->getExtension()) == "mov" || strtolower($fileinfo->getExtension()) == "wmv" || strtolower($fileinfo->getExtension()) == "3gpp" || strtolower($fileinfo->getExtension()) == "ogg") {
                    array_push($result1, false);
                    $result["reason"] = "video"; 
                }else if(strtolower($fileinfo->getExtension()) == "mp3" || strtolower($fileinfo->getExtension()) == "wav" || strtolower($fileinfo->getExtension()) == "mpeg" || strtolower($fileinfo->getExtension()) == "ogg") {
                    array_push($result1, false);
                    $result["reason"] = "player"; 
                }else{
                    $ex = explode("\n", file_get_contents("uploads/".$fileinfo->getFilename()));
                    array_push($result1, $ex);  
                }
                array_push($names, $fileinfo->getFilename());
            }
        }
        $result["data"] = $result1;
        $result["name"] = $names;
        echo json_encode($result); 
    }else if($m == "getfolder"){
        if(isset($_GET["id"])){
            $id = $_GET["id"];
            $result = Array();
            if($id != "playlist"){
                $dir = new DirectoryIterator(dirname(__FILE__)."/uploads/".$id);
                $path = dirname(__FILE__)."/uploads/".$id;
            }else{
                $dir = new DirectoryIterator(dirname(__FILE__)."/".$id);

                $path = dirname(__FILE__)."/".$id;
            }
            foreach ($dir as $fileinfo) {
                if($fileinfo->getFilename() === "." or $fileinfo->getFilename() === ".." or $fileinfo->getFilename()[0] === "."){

                }else{
                    array_push($result, $fileinfo->getFilename());
                }
            }
            $result1 = Array();
            $result1["files"] = $result;
            $result1["paths"] = $path;
            echo json_encode($result1);
	   }else{	
            //$iterator = new DirectoryIterator(dirname(__FILE__));
            //$iterator->getPath();
            $result = Array();
            $dir = new DirectoryIterator(dirname(__FILE__)."/uploads/");
            foreach ($dir as $fileinfo) {
                if($fileinfo->getFilename() === "." or $fileinfo->getFilename() === ".."  or $fileinfo->getFilename()[0] === "."){

                }else if($fileinfo->getExtension() == ""){
                    array_push($result, $fileinfo->getFilename()."(no extension found)");
                }else {
                    array_push($result, $fileinfo->getFilename());
                }
            }
            echo json_encode($result);
	   }
    }else if($m == "upload"){
        if(!empty($_FILES["files"]["name"][0])){
            $source = $_POST["source"];
            $files = $_FILES["files"];
            $uploaded = array();
            $failed = array();
            $path = $_POST["path"];
            $allowed = array("txt", "jpeg", "jpg", "png", "mp4", "mts", "zip", "rar", "tar", "gzip","mp3", "mpeg", "wav", "ogg", "gif", "bmp","css", "html", "php", "c", "cpp", "h", "hpp","webm", "mpeg", "3gpp", "mov", "avi", "mpeggs", "wmv", "flv", "js", "json");

            foreach($files["name"] as $position => $file_name){
                $file_tmp = $files["tmp_name"][$position];
                $file_size = $files["size"][$position];
                $file_error = $files["error"][$position];

                $file_ext = explode(".", $file_name);
                $file_ext = strtolower(end($file_ext));

                if(in_array($file_ext, $allowed)){
                    if($file_error === 0){
                        if($file_size <= 17179869184){
                            $file_name_new = uniqid("", true). ".".$file_ext;
                            $file_destination = $path."/".$file_name;
                            if(move_uploaded_file($file_tmp, $file_destination)){
                                $uploaded[$position] = $file_destination;
                            }else{
                                $failed[$position] = "[{$file_name}] failed to upload.";
                            }
                        }else{
                            $failed[$position] = "[{$file_name}] is too large.";
                        }
                    }else{
                        $failed[$position] = "[{$file_name}] errored with code {$file_error}";
                    }
                }else{
                    $failed[$position] = "[{$file_name}] file extension {$file_ext} is not allowed";
                }
            }

            if(!empty($uploaded)){
                print_r($uploaded);
            }
            if(!empty($failed)){
                print_r($failed);
            }

            ?>
            <button type="button" tabindex="1" class="button" onClick="window.location = '<?php echo $source; ?>'">Weiter</button>
            <?php
            header("Location: ".$source);
        }else{
            echo "Fehler, hast du eine Datei ausgewählt?";
             ?>
            <button type="button" tabindex="1" class="button" onClick="window.location = '<?php echo $source; ?>'">Weiter</button>
            <?php 
            //header("Location: folder.php");
        }
    }else if($m == "save"){
        if(isset($_GET["file"]) && $_GET["data"]){
            $file = $_GET["file"];
            file_put_contents("uploads/".$file, $_GET["data"]); 
        }else{
            echo false;
        }
    }else if($m == "delete"){
        if(isset($_GET["filename"])){
            $filename = $_GET["filename"];
            echo json_encode(unlink("uploads/".$filename));
        }else{
            echo "Error: No filename set!";
        }
    }else if($m == "create"){
        if(isset($_GET["mode"]) && isset($_GET["name"])){
            if($_GET["mode"] == "file"){
                $handle = fopen("uploads/".$_GET["name"], "w");
                echo fclose($handle);
            }else{
                echo mkdir("uploads/".$_GET["name"]);
            }
        }else{
            echo false;
        }
    }
}
?>