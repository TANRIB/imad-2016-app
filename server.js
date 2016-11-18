var express = require('express');
var morgan = require('morgan');
var path = require('path');
var pool = require('pg').Pool;

var config = {
    user: 'tanrib',
    database: 'tanrib',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));


var articles = {
    'article-one' : {
      title:'Article One | Riba Fathima',
      heading:'Article One',
      date:'Sep 5, 2016',
      content:`
          <p>
                        Wordsworth, a staunch lover of nature, believed that nature is a storehouse of joy and pleasure.  It is an everflowing fountain of divine beauty.  It is a friend, a guide and a nurse to man.  It has a healing touch of its own.  A ruined body or a broken mind find a lot of comfort and consolation in the lap of nature.  It provides a man with fresh energy and a new vigour.  It is a manifestation of the divine.
          </p>`
   },
    'article-two' : {
          title:'Article Two | Riba Fathima',
          heading:'Article Two',
          date:'Sep 10, 2016',
         content:`
            <p>
                        A friend is a person that someone likes or knows.

               People who are friends talk to each other and spend time together. They also help each other when they are in trouble or are hurt. Friends are people that can be looked up to and trusted. Sometimes people can't share their secrets with their parents so they can share it with their friends. Usually friends have similar interests. A friend is one who admires a person's skill and helps or encourages them to make the right choices and do not get into any trouble at all.

                The strength of the bond of friendship between two people can vary. If the bond is very strong, they are called best friends. This can usually be achieved by possessing the elements of friendship, by being kind, generous, loyal, honest and by having fun. With these qualities you can truly enjoy the bliss of friendship. There are expectations, demands and complaints in friendship too.
            </p>`    
    },   
    'article-three' : {
       title:'Article Three | Riba Fathima',
       heading:'Article Three',
       date:'Sep 15, 2016',
       content:`
          <p>
                  
                	Kindness is one of the seven virtues. It can be defined as the righteous and caring attitude towards other. But the definition of the kindness does not limit to these two words only. Kindness is a complex term to comprehend yet simplest to realise. Showing kindness towards others gives a feeling of joy and mirth to the recipient. The doer is also satiated by the feeling of warmth and compassion. Kindness is the basic driving force of the nature. The nature is so kind to us that it helps in flourishing the civilizations. The rising sun and the wandering clouds are all the miracles of nature only. Though, the perspective completely changes with the scientific reasoning, yet everyone agrees that the whole cosmos conspires to sustain life and hope.
          </p>`
    }  
};  

function createTemplate (data) {
    var title = data.title;
    var date  = data.date;
    var heading = data.heading;
    var content = data.content;
    
var htmlTemplate = `
  <html>
    <head>
        <title>
            ${title}
        </title>
        <meta name="viewport" content ="width-device-width, initial-scale-1" />
        <link href="/ui/style.css" rel="stylesheet" />
     </head>
    <body>
        <div class= "container">
      <div>
            <a href= "/">Home</a>
        </div>
         <hr/>
         <h3>
            ${heading}
         </h3>
         <div>
             ${date} 
         </div>
         <div>
            ${content}
         </div>
       </div>
     </body>
   </html>
    `;
    return htmlTemplate;
}

app.get('/', function (req, res) {
 res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config);
app.get('/test-db', function (req, res) {
    // make a select request
    // return a response with the results
    pool.query('SELECT * FROM test', function (err, result) {
        if (err) {
            res.status(500).send(err.toString());
        } else {
            res.send(JSON.stringify(result.rows));
        }
    });
});

var counter = 0;
app.get('/counter', function (req,res) {
    counter = counter + 1;
    res.send(counter.toString());
    
});

 var names = [];
app.get('/submit-name', function(req , res) { // URL: /submit-name?name-xxxxx
    // Get the name from the request
    var name = req.query.name;
    
    names.push(name);
    // JSON: Javascript Object Notation
    res.send(JSON.stringify(names));
});

app.get('/:articleName', function (req, res) {
    // articleName == article-one
    // articles[articleName] == {} content object for article one
  
  pool.query("SELECT * FROM article WHERE title = " + req.params.articleName, function (err, result) {
      if (err) {
          res,status(500).send(err.toString());
      } else {
          if (result.rows.length === 0)  {
              res.status(400).send('Article not found');
          } else {
              var articleData = result.rows[0];
              res.send(createTemplate(articleData));
          }   
      } 
   });
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});  

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
 
var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
