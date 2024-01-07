document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(signupForm);

        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            fullName: formData.get('full-name'),
            phone: formData.get('phone'),
            birthdate: formData.get('birthdate'),
        };

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                // Optionally redirect to a login page or perform other actions
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred. Please try again.');
        }
    });
});
