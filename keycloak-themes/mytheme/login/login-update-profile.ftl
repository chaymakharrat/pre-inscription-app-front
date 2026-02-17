<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Compléter le profil - iTech University</title>
    <style>
        /* même style que vos autres pages */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #ffffff 0%, #a5c2e1 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-wrapper { width: 100%; max-width: 480px; padding: 25px; }
        .login-container {
            background: rgba(255,255,255,0.85);
            backdrop-filter: blur(25px);
            border-radius: 32px;
            padding: 50px 45px;
            box-shadow: 0 25px 50px -12px rgba(37,99,235,0.15);
        }
        .login-header { text-align: center; margin-bottom: 30px; }
        .subtitle { color: #1e293b; font-size: 14px; text-transform: uppercase;
                    letter-spacing: 3px; font-weight: 700; }
        .page-title { color: #1e293b; font-size: 22px; font-weight: 700; margin-top: 15px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; color: #475569;
                            font-weight: 600; font-size: 14px; }
        .form-group input {
            width: 100%; padding: 14px 18px;
            border: 2px solid rgba(226,232,240,0.8);
            border-radius: 14px; background: rgba(255,255,255,0.8);
            font-size: 15px; transition: all 0.3s ease;
        }
        .form-group input:focus {
            outline: none; border-color: #3b82f6;
            box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
        }
        .btn-login {
            width: 100%; padding: 16px;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white; border: none; border-radius: 14px;
            font-size: 16px; font-weight: 700; cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-login:hover { transform: translateY(-2px); filter: brightness(1.1); }
    </style>
</head>
<body>
    <div class="login-wrapper">
        <div class="login-container">
            <div class="login-header">
                <p class="subtitle">iTech University</p>
                <h1 class="page-title">Compléter votre profil</h1>
            </div>

            <form action="${url.loginAction}" method="post">
                <div class="form-group">
                    <label>Prénom</label>
                    <input type="text" name="firstName"
                           value="${(user.firstName!'')}"
                           placeholder="Votre prénom" required>
                </div>
                <div class="form-group">
                    <label>Nom</label>
                    <input type="text" name="lastName"
                           value="${(user.lastName!'')}"
                           placeholder="Votre nom" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email"
                           value="${(user.email!'')}"
                           placeholder="votre@email.com" required>
                </div>
                <button type="submit" class="btn-login">
                    Confirmer
                </button>
            </form>
        </div>
    </div>
</body>
</html>