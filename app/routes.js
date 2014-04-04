// app/routes.js

module.exports = function(app, passport, models, controllers) {

// normal routes ===============================================================

        // HOMEPAGE =====================
        app.get('/', controllers.static.index);

        // PROFILE SECTION ==============

        app.get('/profile', isLoggedIn, function(req, res) {
          console.log(req.user._id);
          res.redirect('/profile/' + req.user._id);
        })

// app.get('/profile/:id(^[0-9]+$)', isLoggedIn, function(req, res, next) {
//(/^[a-f\d]{24}$/i) -- regex for mongodb id
        // app.get('/profile', controllers.users.getProfile); // doesnt work; something about can't find model
        app.get('/profile/:id', isLoggedIn, function(req, res, next) {
          var id = req.params.id;
          // var id = req.user._id;
          console.log('in /profile router');
          models.users.find({}, function(err, users) {
             res.render('profile', {
                  user            : req.user,
                  users           : users
             });   
          });
        });

        // LOGOUT =======================
        app.get('/logout', controllers.users.logout);

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

        // locally --------------------------------
                // LOGIN ===============================
                // show the login form
                app.get('/login', controllers.users.login);

                // process the login form
                // app.post('/login', 
                //   passport.authenticate('local-login', 
                //       {
                //         successRedirect : '/profile', // redirect to the secure profile section
                //         failureRedirect : '/login', // redirect back to the signup page if there is an error
                //         failureFlash : true // allow flash messages
                //       }
                //     ));

                app.post('/login', 
                  passport.authenticate('local-login'), function(req, res) {
                      res.redirect('/profile/' + req.user._id);
                    });

                // SIGNUP =================================
                // show the signup form
                app.get('/signup', controllers.users.signupView );

                // process the signup form
                app.post('/signup', passport.authenticate('local-signup', {
                        successRedirect : '/profile', // redirect to the secure profile section
                        failureRedirect : '/signup', // redirect back to the signup page if there is an error
                        failureFlash : true // allow flash messages
                }));

                // app.get('/test', function (req, res) { controllers.test.getTest('1234', res) } ); // work on this
                
                // process the signup form
                // app.post('/signup', function(req, res) { controllers.users.signupLocal(req, res, passport) } );

                // app.post('/signup', passport.authenticate('local-signup', function(req, res) {
                //         console.log(req);
                //         res.redirect('/profile/' + req.user._id);
                // }));

        // facebook -------------------------------

                // send to facebook to do the authentication
                app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
                // app.get('/auth/facebook', controllers.users.authFacebook() ); // ask Bernhard about this

                app.get('/test', function (req, res) { controllers.test.getTest('1234', res) } ); // work on this
                
                // handle the callback after facebook has authenticated the user
                app.get('/auth/facebook/callback', passport.authenticate('facebook', {
                                successRedirect : '/profile',
                                failureRedirect : '/',
                                failureFlash    : true
                        }));

        // twitter --------------------------------

                // send to twitter to do the authentication
                app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

                // handle the callback after twitter has authenticated the user
                app.get('/auth/twitter/callback',
                        passport.authenticate('twitter', {
                                successRedirect : '/profile',
                                failureRedirect : '/',
                                failureFlash    : true
                        }));

        // google ---------------------------------

                // send to google to do the authentication
                app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

                // the callback after google has authenticated the user
                app.get('/auth/google/callback',
                        passport.authenticate('google', {
                                successRedirect : '/profile', // /profile/:id  ?? bernhard
                                failureRedirect : '/',
                                failureFlash    : true
                        }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

        // locally --------------------------------
                app.get('/connect/local', function(req, res) {
                        res.render('connect-local.hbs', { message: req.flash('loginMessage') });
                });
                app.post('/connect/local', passport.authenticate('local-signup', {
                        successRedirect : '/profile', // redirect to the secure profile section
                        failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
                        failureFlash : 'Invalid username or password.' // allow flash messages
                }));

        // facebook -------------------------------

                // send to facebook to do the authentication
                app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

                // handle the callback after facebook has authorized the user
                app.get('/connect/facebook/callback',
                        passport.authorize('facebook', {
                                successRedirect : '/profile',
                                failureRedirect : '/'
                        }));

        // twitter --------------------------------

                // send to twitter to do the authentication
                app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

                // handle the callback after twitter has authorized the user
                app.get('/connect/twitter/callback',
                        passport.authorize('twitter', {
                                successRedirect : '/profile',
                                failureRedirect : '/'
                        }));


        // google ---------------------------------

                // send to google to do the authentication
                app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

                // the callback after google has authorized the user
                app.get('/connect/google/callback',
                        passport.authorize('google', {
                                successRedirect : '/profile/:id',
                                failureRedirect : '/'
                        }));

// =============================================================================
// FEATURES WHEN LOGGED IN =====================================================
// =============================================================================
        // show the edit profile page and form
        // app.get('/profile/edit', controllers.users.edit );

        // why isn't this working ??
        // app.get('/profile/edit', function (req, res) {
        //   console.log('wtf....');
        //   res.send('hello');
        // } );`

        app.get('/profile/edit', controllers.users.edit );

        // on the submission of the form
        app.post('/profile/edit', isLoggedIn, function(req, res, next) {
          models.users.find({}, function(err, user) {
              if (err)
                return done(err);

            user                    = req.user;
            user.info.firstName     = req.body.firstname;
            user.info.lastName      = req.body.lastname;
            user.info.mobileNo      = req.body.mobile;
            user.info.streetAddress = req.body.street;
            user.info.cityAddress   = req.body.city;
            user.info.stateAddress  = req.body.state;

              user.save(function(err) {
                  if (err)
                      throw err;
              });
             res.redirect('/profile');   
          });
        });


// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

        // local -----------------------------------
        app.get('/unlink/local', function(req, res) {
                var user            = req.user;
                user.local.email    = undefined;
                user.local.password = undefined;
                user.save(function(err) {
                        res.redirect('/profile');
                });
        });

        // facebook -------------------------------
        app.get('/unlink/facebook', function(req, res) {
                var user            = req.user;
                user.facebook.token = undefined;
                user.save(function(err) {
                        res.redirect('/profile');
                });
        });

        // twitter --------------------------------
        app.get('/unlink/twitter', function(req, res) {
                var user           = req.user;
                user.twitter.token = undefined;
                user.save(function(err) {
                        res.redirect('/profile');
                  });
        });

        // google ---------------------------------
        app.get('/unlink/google', function(req, res) {
                var user          = req.user;
                user.google.token = undefined;
                user.save(function(err) {
                        res.redirect('/profile');
                });
        });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
                return next();

        res.redirect('/');
}