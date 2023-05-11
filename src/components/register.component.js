import React, { Component, useEffect } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { withRouter } from '../common/with-router';
import "../App.css";

import AuthService from "../services/auth.service";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const email = value => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};
//валидация
const vfirstname = value => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The firstname must be between 3 and 20 characters.
      </div>
    );
  }
};

const vlastname = value => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The lastname must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = value => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const vcode = value => {
  if (value.length !== 6) {
    return (
      <div className="alert alert-danger" role="alert">
        The code must have 6 digital.
      </div>
    );
  }
};

 class Register extends Component {
  constructor(props) {
    super(props);

    this.handleRegister = this.handleRegister.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.onChangeCode = this.onChangeCode.bind(this);
    this.onChangeFirstname = this.onChangeFirstname.bind(this);
    this.onChangeLastname = this.onChangeLastname.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeCurrentView = this.changeView.bind(this)

    this.state = {
      currentView: "register",
      firstname: "shhshshshs",
      lastname: "dfsfsdfsdfsdf",
      email: "sdfsdfd@mail.ru",
      code: "",
      password: "KJDHFsd!43kjkeAAAdfsdf",
      successful: false,
      message: ""
    };
    
  }

  changeView = (view) => {
    this.setState({
      currentView: view
    })
  }

  onChangeFirstname(e) {
    this.setState({
      firstname: e.target.value
    });
  }

  onChangeLastname(e) {
    this.setState({
      lastname: e.target.value
    });
  }
  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangeCode(e) {
    this.setState({
      code: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.register(
        this.state.firstname,
        this.state.lastname,
        this.state.email,
        this.state.password
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true,
            currentView: "confirm"
          });
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

            this.setState({
              loading: false,
              message: resMessage
            });
        }
      );
    }else {
      this.setState({
        loading: false
      });
    }
  }

  handleConfirm(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.confirm(
        this.state.code,
        this.state.email,
        this.state.password)
        .then(
          () => {
            this.props.router.navigate("/home");
            window.location.reload();
          },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            loading: false,
            message: resMessage
          });
        }
      );
    } else {
      this.setState({
        loading: false
      });
    }
  }

currentView = () => {
      switch(this.state.currentView) {
          case "register" :
            return (      
                <Form
                  onSubmit ={this.handleRegister}
                  ref={c => {
                    this.form = c;
                  }}
                >
                  {!this.state.successful && (
                    <div>
                      <div className="form-group">
                        <label htmlFor="firstname">Firstname</label>
                        <Input
                          type="text"
                          className="form-control"
                          name="firstname"
                          value={this.state.firstname}
                          onChange={this.onChangeFirstname}
                          validations={[required, vfirstname]}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastname">Lastname</label>
                        <Input
                          type="text"
                          className="form-control"
                          name="lastname"
                          value={this.state.lastname}
                          onChange={this.onChangeLastname}
                          validations={[required, vlastname]}
                        />
                      </div>
      
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <Input
                          type="text"
                          className="form-control"
                          name="email"
                          value={this.state.email}
                          onChange={this.onChangeEmail}
                          validations={[required, email]}
                        />
                      </div>
      
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <Input
                          type="password"
                          className="form-control"
                          name="password"
                          value={this.state.password}
                          onChange={this.onChangePassword}
                          validations={[required, vpassword]}
                        />
                      </div>
                      <div className="form-group">
                    <button
                      className="btn btn-primary btn-block"
                      disabled={this.state.loading}
                    >
                      {this.state.loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                      )}
                      <span>SignUp</span>
                    </button>
                  </div>
                    </div>
                  )}
      
                  {this.state.message && (
                    <div className="form-group">
                      <div className="alert alert-danger" role="alert">
                        {this.state.message}
                      </div>
                    </div>
                  )}  
                  <CheckButton
                    style={{ display: "none" }}
                    ref={c => {
                      this.checkBtn = c;
                    }}
                  />
                </Form>
            );
            break
          case "confirm" :
            return (
              <Form
              onSubmit={this.handleConfirm}
              ref={c => {
                this.form = c;
              }}
            >
                <div className="form-group">
                    <label htmlFor="code">6-digital code</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="code"
                      value={this.state.code}
                      onChange={this.onChangeCode}
                      validations={[required, vcode]}
                    />
                  </div>
                  <div className="form-group">
                    <button className="btn btn-primary btn-block">Send</button>
                  </div>
            
              {this.state.message && (
                <div className="form-group">
                  <div
                    className={
                      this.state.successful
                        ? "alert alert-success"
                        : "alert alert-danger"
                    }
                    role="alert"
                  >
                    {this.state.message}
                  </div>
                </div>
              )}
              <CheckButton
                style={{ display: "none" }}
                ref={c => {
                  this.checkBtn = c;
                }}
              />
            </Form>
            );
            break
        default : break
      };
  }
  
  render() {
    return (
      <div className="col-md-12" id="reg">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />
            {this.currentView()}
      </div>
      </div>
    )
  }
}

export default withRouter(Register);