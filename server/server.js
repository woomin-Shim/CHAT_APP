const exprss = requie('express');
const app = express();

const path = require('path');

const prot = process.env.PORT || 5000;

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
    
    app.get('*', (req, res) => {
        req.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    })
}
app.listen(port, (err) => {
    if (err) return console.log(err);
    console.log('Sever running on port : ', port);
})