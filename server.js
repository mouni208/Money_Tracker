const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 4000; // Change 4000 to any available port


mongoose.connect('mongodb+srv://pk:pk@cluster0.8lulz4b.mongodb.net/?retryWrites=true&w=majority' ,{ useNewUrlParser: true,
useUnifiedTopology: true,
connectTimeoutMS: 30000, 
socketTimeoutMS: 30000,});  //
const userSchema = new mongoose.Schema({
    username: String,
    budget: Number,
    income: Number,
    email: String,
    password: String,
    fullName: String,
    phone: String,
    birthdate: Date,
    expenses: [{
        feild:String,
        // type: { type: String },
        // type: mongoose.Schema.Types.Mixed,
        amount: Number
    }]
});







const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname)));
// const User = mongoose.model('User', userSchema);

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
// app.use(express.static(path.join(__dirname)));
app.post('/signup', async (req, res) => {
    try {
        const { username, email, password, fullName, phone, birthdate } = req.body;

        const newUser = new User({
            username,
            email,
            password,
            fullName,
            phone,
            birthdate,
        });

        const savedUser = await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: savedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });

        if (user) {
            req.session.user = user;
            res.redirect('/dashboard');
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'dashboard.html'));
    } else {
        res.redirect('/login');
    }
});

app.get('/add-budget', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'add-budget.html'));
    } else {
        res.redirect('/login');
    }
});
app.post('/add-budget', async (req, res) => {
    try {
        const { budgetAmount } = req.body;
        const userId = req.session.user ? req.session.user._id : null;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.income && parseFloat(budgetAmount) <= parseFloat(user.income)) {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: { budget: parseFloat(budgetAmount) } },
                { new: true }
            );

            if (updatedUser) {
                return res.status(200).json({ message: 'Budget added successfully', user: updatedUser });
            } else {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            return res.status(400).json({ error: 'Budget must be less than or equal to income' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/add-income', async (req, res) => {
    try {
        const { incomeAmount } = req.body;
        const userId = req.session.user ? req.session.user._id : null;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { income: incomeAmount } },
            { new: true }
        );

        if (updatedUser) {
            return res.status(200).json({ message: 'Income added successfully', user: updatedUser });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// // Add this route to your existing Node.js code
// app.get('/add-expense', (req, res) => {
//     res.sendFile(path.join(__dirname, 'add-expense.html'));
// });



// // Assuming you have your User model defined and imported
// // const User = require('./models/user'); 

// // Express route for adding expenses
// app.post('/add-expense', async (req, res) => {
//   try {
//     // Assuming req.body contains the expense data from the frontend
//     const { type, amount } = req.body;
//     const userId = req.session.user ? req.session.user._id : null;
//     // Find the user by some identifier (e.g., user ID)
//     // const userId = 'yourUserId'; // Replace with your actual user ID
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Add the expense to the "expenses" array
//     user.expenses.push({ type, amount });

//     // Save the user with the updated expenses
//     await user.save();

//     // Respond with success
//     res.status(200).json({ success: true, message: 'Expense added successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });



// Express route for adding expenses
app.post('/add-expense', async (req, res) => {
    try {
      // Check if the user is logged in
      if (!req.session.user || !req.session.user._id) {
        return res.status(401).json({ error: 'Unauthorized - User not logged in' });
      }
  
      // Assuming req.body contains the expense data from the frontend
      const { feild, amount } = req.body;
  
      // Find the user by user ID from the session
      const userId = req.session.user._id;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Add the expense to the "expenses" array
      user.expenses.push({ feild, amount });
  
      // Save the user with the updated expenses
      await user.save();
  
      // Respond with success
      res.status(200).json({ success: true, message: 'Expense added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Express route for rendering the expenses page
// Assuming you have your User model defined and imported
// const User = require('./models/user'); 

// Express route for fetching expenses
app.get('/expenses', async (req, res) => {
    try {
      const userId = req.session.user ? req.session.user._id : null;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ expenses: user.expenses });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
