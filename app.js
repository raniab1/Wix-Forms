const express = require('express');
const app = express();
const port = 3000;

//it is a comment

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

let forms = [];
let formId = 1;

// Routes
app.get('/', (req, res) => {
  res.render('index', { forms });
});

app.get('/form-builder', (req, res) => {
  res.render('formBuilder');
});

app.post('/form-builder', (req, res) => {
  const { fields, formName } = req.body;

  // Parse the JSON string into an object
  const parsedFields = JSON.parse(fields);

  const form = {
    id: formId++,
    name: formName,
    submissions: 0,
    fields: parsedFields,
  };
  forms.push(form);

  const response = {
    success: true,
    message: 'Form created successfully',
    form: form,
  };

  res.json(response);
});



app.get('/form-submit/:id', (req, res) => {
  const formId = parseInt(req.params.id);
  const form = forms.find((form) => form.id === formId);

  if (form) {
    if (form.fields && form.fields.length) {
      res.render('formSubmit', { formId, fields: form.fields });
    } else {
      res.status(404).send('No fields found for this form');
    }
  } else {
    res.status(404).send('Form not found');
  }
});


app.post('/form-submit/:id', (req, res) => {
  const formId = parseInt(req.params.id);
  const form = forms.find((form) => form.id === formId);

  if (form) {
    // Save form submission data (you can customize this part as needed)
    const formData = req.body;
    // Check if form.submissions is already an array, otherwise create an empty array
    form.submissions = Array.isArray(form.submissions) ? form.submissions : [];
    // Push the submission data to the submissions array
    form.submissions.push(formData);

    res.redirect(`/form-submissions/${formId}`);
  } else {
    res.status(404).send('Form not found');
  }
});

app.get('/form-list', (req, res) => {
  res.render('formList', { forms });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
