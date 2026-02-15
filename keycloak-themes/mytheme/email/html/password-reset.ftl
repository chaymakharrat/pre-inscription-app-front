<#outputformat "HTML">
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code de vérification - iTech University</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- En-tête -->
        <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">iTech University</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">Portail Étudiant</p>
        </div>
        
        <!-- Contenu -->
        <div style="padding: 40px 30px;">
            <h2 style="color: #1e293b; margin: 0 0 10px 0; font-size: 24px; text-align: center;">Vérification de votre identité</h2>
            
            <p style="color: #64748b; line-height: 1.6; margin: 0 0 30px 0; text-align: center;">
                Vous avez demandé la réinitialisation de votre mot de passe.<br>
                Cliquez sur le bouton ci-dessous pour continuer :
            </p>
            
            <!-- Bouton principal -->
            <div style="text-align: center; margin: 40px 0;">
                <a href="${link}" 
                   style="display: inline-block; 
                          padding: 18px 50px; 
                          background: linear-gradient(135deg, #2563eb, #1d4ed8); 
                          color: white; 
                          text-decoration: none; 
                          border-radius: 12px; 
                          font-weight: 700; 
                          font-size: 18px;
                          box-shadow: 0 8px 16px rgba(37, 99, 235, 0.4);">
                    Réinitialiser mon mot de passe
                </a>
            </div>
            
            <!-- Informations de sécurité -->
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 40px 0;">
                <p style="color: #92400e; margin: 0 0 12px 0; font-size: 15px; font-weight: 600;">
                    🛡️ Informations de sécurité
                </p>
                <ul style="color: #78350f; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                    <li><strong>Expiration :</strong> Ce lien est valable pendant 5 minutes</li>
                    <li><strong>Confidentialité :</strong> Ne partagez jamais ce lien avec personne</li>
                    <li><strong>Pas vous ?</strong> Ignorez cet email, votre compte reste sécurisé</li>
                </ul>
            </div>
            
            <!-- Lien alternatif -->
            <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                Si le bouton ne fonctionne pas, copiez ce lien :<br>
                <span style="color: #2563eb; word-break: break-all; font-size: 11px;">${link}</span>
            </p>
            
            <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 40px 0 0 0; text-align: center;">
                Cordialement,<br>
                <strong>L'équipe iTech University</strong>
            </p>
        </div>
        
        <!-- Pied de page -->
        <div style="background: #f8fafc; padding: 25px 30px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0 0 5px 0;">
                © 2024 iTech University | Direction des Systèmes d'Information
            </p>
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
            </p>
        </div>
    </div>
</body>
</html>
</#outputformat>
