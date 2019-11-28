var folderBucketName = 'studentcourse';
var bucketRegion = 'us-east-1';


const ID = '---your_key---';
const SECRET = '---your_secret---';

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
  }