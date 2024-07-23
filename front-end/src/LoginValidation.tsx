const Validation = (values: { username: any; password: any }) => {
    let error = {
        username: '',
        password: ''
    }
    //const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    if (values.username === "")
        error.username = "Username cannot be empty"
    else if (!(/^.{0,20}$/).test(values.username))
        error.username = "Username too long; must be under 20 characters"
    else   
        error.username = ""

    if (values.password === "")
        error.password = "Password cannot be empty"
    else if (!(/^.{0,30}$/).test(values.password))
        error.password = "Password too long; must be under 30 characters"
    else   
        error.password = ""

    return error;
}

export default Validation;