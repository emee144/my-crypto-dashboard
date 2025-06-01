# Code Citations

## License: unknown
https://github.com/gilsondev/react-tutorials/tree/f5fe19eeb176b6b215ad981850105116bfe945bb/tutorial-02-login-page/src/components/LoginForm.js

```
> {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [
```


## License: unknown
https://github.com/ai-is-awesome/react-expense-tracker/tree/82e88af10051c78a9b8661b77fb30549b94dc91f/src/pages/Signup.js

```
, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] =
```


## License: unknown
https://github.com/federicogdev/api-compass/tree/44058437be8f22c8dd971cac76844e12e46840ec/components/Modals/LoginModal.tsx

```
= z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
}
```


## License: MIT
https://github.com/Phillipml/s.t.a.r.s/tree/b3dc072f2a23ca9f15de7d1e4b2ff3d727202686/client/src/pages/Login/Login.js

```
method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
```


## License: unknown
https://github.com/shimul-das/collaborate-task-management-system/tree/002493a72aed14b70f85d470555a8d621927cb02/src/Pages/Login/Login.jsx

```
"mb-4">
            <label htmlFor="email" className="block text-gray-600">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) =>
```

