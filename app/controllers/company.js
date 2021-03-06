// GET, /companies, index
exports.index = function(req, res, models) {
  models.companies.find( {} , function(err, companies) {
    res.json(companies);
  });
};

// GET, /companies/new, new
exports.new = function(req, res, models) {
  console.log('this function currently handled after user sign up');
};

// POST, /companies, create
exports.create = function(req, res, models) {
  var userId = req.params.id;

  var newCompany            = new models.companies();
  newCompany.name           = req.body.companyname;
  newCompany.email          = req.body.companyemail;
  newCompany.phoneNumber    = req.body.companymobile;
  newCompany.streetAddress  = req.body.companystreet;
  newCompany.cityAddress    = req.body.companycity;
  newCompany.stateAddress   = req.body.companystate;
  newCompany.save();

  // --!-- need help here
  console.log(newCompany._id); //  how to retrieve and make an association?

  models.users.find({ _id : userId }, function(err, users) {
    if (!users.length) {
      res.send('user not found.\n');
      return;
    };
    var user = users[0];
    user.company.push(1); // how to set as Id of new company ?
    user.save(); 
  });

  res.redirect('/users/' + req.user._id +'?created=true');  
};

// GET, /companies/:id, show
exports.show = function (req, res, models) {
	var id = req.params.id;
  models.companies.find({ _id : id }, function(err, company) {
    if (!company.length) {
      res.send('company with an id of ' + id + ' not found.\n');
      return;
    };
    res.json(company);
  });
};

// GET, /companies/:id/edit, edit
exports.edit = function (req, res) {
  res.send('ability to edit company not yet implemented\n');
};

// PUT, /companies/:id, update
exports.update = function (req, res, models) {
  var userId = req.params.id;
  var companyId = req.body;

  models.companies.find( { _id : companyId }, function(err, company) {
    
    if (!company.length) {
      res.json('company with an id of '+id+' not found\n');
      return;
    }

    console.log('stuff');

    var company = company[0];

    console.log(company);

    // --!-- need help here
    // TypeError: Cannot read property 'length' of undefined
    company.users.push(userId);  // right way to do this ?
    res.json('created');
  });
};

// DELETE, /companies/:id, destroy
exports.destroy = function (req, res, models) {
  var id = req.params.id;
    models.companies.find({ _id : id}, function(err, user) {
      res.json('ability to delete company not yet implemented');
      res.redirect('/?delete=true');   
  });
};