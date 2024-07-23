const Validation = (values: { firstName: string; lastName: string; username: string; password: string }) => {
    let error = {
        firstName: '',
        lastName: '',
        username: '',
        password: ''
    }
    //const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/
    if (!(/^.{0,20}$/).test(values.firstName))
        error.firstName = "First name too long; must be under 20 characters"
    else   
        error.firstName = ''

    if (!(/^.{0,20}$/).test(values.lastName))
        error.lastName = "Last name too long; must be under 20 characters"
    else   
        error.lastName = ''
    
    if (values.username === '')
        error.username = "Username cannot be empty"
    else if (!(/^.{0,20}$/).test(values.username))
        error.username = "Username too long; must be under 20 characters"
    else   
    {
        error.username = ''
        console.log(error.username);
    }

    if (values.password === '')
        error.password = "Password cannot be empty"
    else if (!(/^.{0,30}$/).test(values.password))
        error.password = "Password too long; must be under 30 characters"
    else   
        error.password = ""

    return error;
}

export default Validation;