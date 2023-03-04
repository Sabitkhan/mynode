// const express = require("express");
const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const path = require("path");

const app = express();

const staticPath = path.join(__dirname, "../public");

app.use(express.static(staticPath));

//data base connection
main().catch((err) => console.log(err));
async function main() {
    await mongoose
        .connect(
            "mongodb://127.0.0.1:27017/Student_api",
            { useNewUrlParser: true },
            mongoose.set("strictQuery", false)
        )
        .then(() => console.log("Connected to DB"))
        .catch((err) => console.log(err));

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const StudentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    email: {
        type: String,
        unique: [true, "Email Already Exists"],
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        },
    },
    phone: {
        type: Number,
        min: 11,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
});

const student = new mongoose.model("student", StudentSchema);
app.use(express.json());

//restApi using Postman
app.post("/students", async (req, res) => {
    try {
        const user = new student(req.body);
        const createStudent = await user.save();
        res.status(201).send(createStudent);
        console.log(createStudent);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get("/student", async (req, res) => {
    try {
        const StudentDetail = await student.find();
        res.send(StudentDetail);
    } catch (error) {
        res.send(error);
    }
});

app.get("/students/:name",async(req,res)=>{
    try {
        const student_data= await student.findById(req.params.name);
        res.send(student_data);  
        
    } catch (error) {
    res.send(error) }
})
app.get("/", (req, res) => {
    res.sendFile("index");
});

app.listen(3000, () => {
    console.log("Server is runong on port 3000");
});
