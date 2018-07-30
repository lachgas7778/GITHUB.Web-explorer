/********************************************************************************************************/
document.getElementById("uploader").innerHTML = '<div id=\"uplo\">\n<form id=\"upload_form\" enctype=\"multipart/form-data\" method=\"post\" action=\"handler.php\" hidden>\n<input type=\"file\" name=\"files[]\" id=\"fileUp\" multiple hidden>\n<input type=\"text\" name=\"source\" id=\"source\" hidden>\n<input type=\"text\" name=\"path\" id=\"path\" value=\"uploads/\" hidden>\n</form>\n<div class=\"grid grid-4 top w3-theme-l2\">\n<button class=\"btn w3-theme\" id=\"openinFile\"><i class=\"fas fa-file-upload\"></i> BROWSE</button>\n<button onclick=\"refresh()\" class=\"btn w3-theme-d1\"><i class=\"fas fa-sync-alt\"></i> REFRESH</button>\n<button onclick=\"move()\" class=\"btn w3-theme-d3\"><i class=\"fas fa-expand-arrows-alt\"></i> Move</button>\n<div class=\"dropdown\">\n<button onclick=\"myFunction()\" class=\"btn w3-theme-d5\"><i class=\"fas fa-plus-circle\"></i> CREATE</button>\n<div id=\"myDropdown\" class=\"dropdown-content\">\n<input type=\"text\" placeholder=\"Search...\" id=\"myInput\" onkeyup=\"filterFunction()\">\n<a href=\"javascript: cr(\'folder\')\">Folder</a>\n<a href=\"javascript: cr(\'file\')\">File</a>\n</div>\n</div>\n</div>\n<div class=\"grid grid-1 main w3-theme-l2\" id=\"shower\">\n</div>\n<div class=\"info\">\nsupported formats: <i title=\"txt, jpeg, jpg, png, mp4, mts, zip, rar, tar, gzip, mp3, mpeg, wav, ogg, gif, bmp, css, html, php, c, cpp, h, hpp, webm, mpeg, 3gpp, mov, avi, mpeggs, wmv, flvjs, json\" class=\"fas fa-info-circle\"></i>\n</div>\n</div>\n<ul class=\'custom-menu\'>\n<li data-action=\"details\">Details</li>\n<li data-action=\"delete\">Delete</li>\n<li data-action=\"rename\">Rename</li>\n</ul>\n<div id=\"myModal\" class=\"modal\">\n<div class=\"modal-content\">\n<div class=\"modal-header\">\n<h3 id=\"modal_header\"></h3>\n<span class=\"close\">×</span>\n</div>\n<div class=\"modal-body\" id=\"modal_body\">\n<div id=\"editor\" style=\"position: absolute;top: 0;right: 0;bottom: 0;left: 0;\"></div>\n<img src=\"\" alt=\"Picture\" id=\"editorPicture\">\n<audio src=\"\" id=\"editorPlayer\" controls>\nYour browser does not support the <code>audio</code> element.\n</audio>\n<video src=\"\" id=\"editorVideoPlayer\" controls>\nYour browser does not support the <code>video</code> element.\n</video>\n</div>\n<div class=\"modal-footer\" id=\"modal_footer\">\n<h3>\n<a href=\"\" id=\"downloadBtn\" download>Download</a>\n<button onclick=\"changeSettings(\'edit\')\" class=\"sbtn\" id=\"editbtn\">Edit</button>\n<button onclick=\"changeSettings(\'save\')\" class=\"sbtn\" id=\"savebtn\">Save</button>\n</h3>\n</div>\n</div>\n</div>';
var uploadFolder = "uploads";
var editor = ace.edit("editor");
window.onload = function (event) {
    var clientWidth = document.getElementById('uplo').clientWidth;
    if (clientWidth < 830) {
        let x = document.getElementsByClassName("btn");
        for (let i = 0; i < x.length; i++) {
            x[i].className += " btn830px";
        }
    }
    if (clientWidth < 500) {
        let x = document.getElementsByClassName("btn");
        for (let i = 0; i < x.length; i++) {
            x[i].className += " btn500px";
        }
    }

    if (clientWidth < 350) {
        let x = document.getElementsByClassName("file");
        for (let i = 0; i < x.length; i++) {
            x[i].className += " file350px";
        }
        let y = document.getElementsByClassName("allow");
        for (let i = 0; i < y.length; i++) {
            y[i].className += " allow350px";
        }
    }

    if (clientWidth < 300) {
        console.log(300)
        let x = document.getElementsByClassName("grid-4");
        for (let i = 0; i < x.length; i++) {
            x[i].className = x[i].className.replace("grid-4", "grid-1");
            //x[i].className += " grid-4300px";
        }
        let y = document.getElementsByClassName("top");
        for (let i = 0; i < y.length; i++) {
            y[i].className = y[i].className.replace("top", "top300px");
            //y[i].className += " top300px";
        }
        let z = document.getElementsByClassName("main");
        for (let i = 0; i < z.length; i++) {
            z[i].className = z[i].className.replace("main", "main300px");
            //z[i].className += " main300px";
        }
        let k = document.getElementsByClassName("info");
        for (let i = 0; i < k.length; i++) {
            k[i].className = k[i].className.replace("info", "info300px");
            //k[i].className += " info300px";
        }
    }


    /*****************************************************************************************************/
    
    editor.setTheme("ace/theme/monokai");
    //editor.session.setMode("ace/mode/javascript");
    editor.setReadOnly(true);
    editor.session.setUseWrapMode(true);
};
var cvar;
var currentFile = "";
document.getElementById("fileUp").onchange = function (e) {
    cvar = e;
    $("#upload_form").submit();
};

function changeSettings(mode) {
    if (mode == "edit") {
        editor.setReadOnly(false);
    } else if (mode == "save") {
        let curfile = data["name"][data["name"].length - 1];
        editor.setReadOnly(true);
        $.ajax({
            url: "handler.php",
            data: {
                file: curfile,
                data: editor.getValue(),
                utility: "save"
            },
            success: function (result) {
                alert(curfile + " has been saved");
                console.log(result)
                refresh();
            },
            error: function (error) {
                console.log(error.responseText)
            }
        });
    } else if (mode == "") {

    }
}

var cross = [];
var allowed = ["txt", "jpeg", "jpg", "png", "mp4", "mts", "zip", "rar", "tar", "gzip", "mp3", "mpeg", "wav", "ogg", "gif", "bmp", "css", "html", "php", "c", "cpp", "h", "hpp", "webm", "mpeg", "3gpp", "mov", "avi", "mpeggs", "wmv", "flv", "js", "md"];
$('#openinFile').click(function () {
    $('#fileUp').trigger('click');
})

$(".fas.fa-info-circle, .info").on("click", function () {
    alert("Supported formats: \ntxt, jpeg, jpg, png, mp4, mts, zip(coming soon), rar, tar, gzip, mp3, mpeg, wav, ogg, gif, bmp, css, html, php, c, cpp, h, hpp, webm, mpeg, 3gpp, mov, avi, mpeggs, wmv, flv, js");
})


function includes(ex) {
    if (allowed.indexOf(ex) != -1) {
        return true;
    } else {
        return false;
    }
}

function refresh() {
    $("#shower").empty();
    var path = document.getElementById("source").value;
    $.ajax({
        url: "handler.php",
        dataType: "json",
        data: {
            utility: "getfolder",
            uploadFolder: uploadFolder
        },
        success: function (result) {
            cross = result;
            for (let i = 0; i < result.length; i++) {
                var ext = result[i].substring(result[i].lastIndexOf(".") + 1, result[i].length);
                if (includes(ext.toLowerCase()) == true) {
                    $("#shower").append('<button onclick="file(this)" draggable="true" class="file context-menu" id="' + result[i] + '" name="' + result[i] + '"><i class="fas fa-file"></i> <span class="acti">' + result[i] + '</span></button>');
                } else {
                    $("#shower").append('<button class="file context-menu" id="' + result[i] + '" name="' + result[i] + 'error"><i class="fas fa-file"></i> <span class="acti">' + result[i] + '(not supported)</span></button>');
                }
            }
        },
        error: function (error) {
            console.log(error)
        }
    }).done(function () {
        binder();
    })
}
refresh();

function dele(file) {
    if (file.indexOf("(no extension found)") != -1) {
        file = file.replace("(no extension found)", "");
    }
    $.ajax({
        url: "handler.php",
        data: {
            filename: file,
            utility: "delete"
        },
        success: function (result) {
            alert(file + " has been deleted");
            refresh();
        },
        error: function (error) {
            console.log(error.responseText)
        }
    });
}


function move() {
    // move über rename(PHP) implementieren
    alert("not installed")
}

function cr(type) {
    if (type == "file") {
        var ask = prompt("Name (Add extension!):", ID());
        if (ask != null) {
            create(type, ask);
        } else {
            return;
        }
    } else {
        alert("not installed")
    }
    document.getElementById("myDropdown").classList.toggle("show");

}

function create(type, name) {
    $.ajax({
        url: "hanlder.php",
        data: {
            mode: type,
            name: name,
            utility: "create"
        },
        success: function (result) {
            alert(name + " has been created! Status: " + result);
        },
        error: function (error) {
            console.log(error.responseText)
        }
    });
}




function binder() {
    $(".context-menu").bind("contextmenu", function (event) {
        currentFile = $(this)[0].id;
        event.preventDefault();
        $(".custom-menu").finish().toggle(100).
        css({
            top: event.pageY + "px",
            left: event.pageX + "px"
        });
    });
}

$(document).bind("mousedown", function (e) {
    if (!$(e.target).parents(".custom-menu").length > 0) {
        $(".custom-menu").hide(100);
    }
});


$(".custom-menu li").click(function () {
    switch ($(this).attr("data-action")) {
        case "details":
            alert("Details not installed");
            break;
        case "rename":
            rename();
            break;
        case "delete":
            dele(currentFile)
            break;
    }
    $(".custom-menu").hide(100);
})

function rename() {
    alert("Not installed");
}

var data;

function file(a) {
    readF(a);
}

function readF(id) {

    $.ajax({
        url: "handler.php",
        dataType: "json",
        data: {
            id: id.id,
            utility: "read"
        },
        success: function (result) {
            data = result;
        },
        error: function (error) {
            console.log(error)
        }
    }).done(function () {
        if (data == "undefined") {
            alert("ERROR");
            return;
        }
        $("#editor").hide();
        $("#editorPicture").hide();
        $("#editorPlayer").hide();
        $("#editorVideoPlayer").hide();
        $("#savebtn").show();
        $("#editbtn").show();
        $("#modal_body").css("background-color", "white");
        let ext = data["name"][data["name"].length - 1].split(".");
        ext = ext[ext.length - 1].toLowerCase();
        var modal = document.getElementById('myModal');
        var span = document.getElementsByClassName("close")[0];
        $("#modal_header").text(data["name"][data["name"].length - 1]);
        // zip, rar, tar, gzip, mp3, , wav, c, cpp, h, hpp,
        if (ext == "txt" || ext == "js" || ext == "css" || ext == "html" || ext == "php" || ext == "css" || ext == "c" || ext == "cpp" || ext == "h" || ext == "hpp") {
            editor.setValue("");
            let str = String();
            for (let i = 0; i < data["data"][data["name"].length - 1].length; i++) {
                str += data["data"][data["name"].length - 1][i];
            }
            if (str == undefined) {
                str = "";
            }
            editor.setValue(str);
            $("#editor").show();
        } else if (ext == "png" || ext == "jpg" || ext == "jpeg" || ext == "bmp" || ext == "gif") {
            $("#savebtn").hide();
            $("#editbtn").hide();
            $("#editorPicture").attr("src", "uploads/" + data["name"][data["name"].length - 1]);
            $("#editorPicture").show();
            $("#modal_body").css("background-color", "black");
        } else if (ext == "mp4" || ext == "mts" || ext == "avi" || ext == "webm" || ext == "mpeg4" || ext == "mpeggs" || ext == "flv" || ext == "mov" || ext == "wmv" || ext == "3gpp" || ext == "ogg") {
            $("#savebtn").hide();
            $("#editbtn").hide();
            $("#editorVideoPlayer").show();
            $("#editorVideoPlayer").attr("src", "uploads/" + data["name"][data["name"].length - 1]);
            $("#modal_body").css("background-color", "black");
        } else if (ext == "mp3" || ext == "mpeg" || ext == "wav" || ext == "ogg") {
            $("#savebtn").hide();
            $("#editbtn").hide();
            $("#editorPlayer").show();
            $("#editorPlayer").attr("src", "uploads/" + data["name"][data["name"].length - 1]);
            $("#modal_body").css("background-color", "black");
        } else {

        }
        $("#downloadBtn").attr("href", "uploads/" + data["name"][data["name"].length - 1]);
        modal.style.display = "block";
        span.onclick = function () {
            modal.style.display = "none";
        }
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    })
}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}
var ID = function () {
    return Math.random().toString(36).substr(2, 9);
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/******************************************************************************************************/
