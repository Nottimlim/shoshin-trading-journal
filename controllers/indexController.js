exports.getHomePage = (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('auth/login', { layout: 'layouts/auth', isLoginPage: true });
};
