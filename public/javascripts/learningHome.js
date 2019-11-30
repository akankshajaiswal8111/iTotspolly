var folderBucketName = 'studentcourse';
var bucketRegion = 'us-east-1';


const ID = '--yourkey--';
const SECRET = '--yoursecret--';

//update config
AWS.config.update({
    region: bucketRegion,
    accessKeyId : ID,
    secretAccessKey : SECRET
  });


  var s3 = new AWS.S3({
    params: {Bucket: folderBucketName}
  });



var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var queries = queryString.split("&");

  function listFolders() {
    s3.listObjects({Delimiter: '/'}, function(err, data) {
      if (err) {
        return alert('There was an error showing your courses folder: ' + err.message);
      } else {
        var folders = data.CommonPrefixes.map(function(commonPrefix) {
          var prefix = commonPrefix.Prefix;
          var folderName = decodeURIComponent(prefix.replace('/', ''));
         
          return getHtml([
              '<button onclick="location.href=\'http://ec2-34-207-163-214.compute-1.amazonaws.com:3000/learningCourse/' + folderName + '\'" style="border:solid 0px #e6b215;border-radius:8px;font-size:16px;color:#ffffff;padding:5px 18px;background-color:#FF9900;cursor:pointer;">' + folderName + '</button>',
          ]);
        });
        
          
        var htmlTemplate = [
            '<h1>Learning Course</h1>',
          '<ul>',
            getHtml(folders),
          '</ul>',
        '<br/>',
        '<br/>',
        ]
        document.getElementById('learninghomePage').innerHTML = getHtml(htmlTemplate);
      }
    });
    showButton();

  }

  function showButton(folder, id)
  {
    var folderKey = encodeURIComponent(folder) + '/'; //use FolderName here
  s3.listObjects({Prefix: folderKey}, function(err, data) {
   
    if (err) {
      return alert('There was an error viewing your folder: ' + err.message);
    }
    var href = this.request.httpRequest.endpoint.href;
    var bucketUrl = href + folderBucketName + '/';
    var countFiles = 0;
    
  var courseImg = data.Contents.map(function(res){
    //check if user has uploaded image, and if he has, then increment count
     var fileKey = res.Key;
     var filName = fileKey.replace(folderKey, '');
     var substring = folder + '_quiz'; //use FolderName here
    
     if(filName != '' && !filName.toUpperCase().includes(substring.toUpperCase()))
     {
       countFiles++;
        
     }
     
    if(countFiles == id) //put value of ur slidenumber instead of 4
    {
      document.getElementById(dvFinish);
      if(dvFinish.style.display == 'block')
      dvFinish.style.display = 'none';
       else
       dvFinish.style.display = 'block';
    }
    });
  });
  }
