exports.getHomePage = (req, res) => {
  console.log("User: ", req.session.user)
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('auth/login', { layout: 'layouts/auth', isLoginPage: true });
};
