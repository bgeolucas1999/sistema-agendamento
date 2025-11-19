# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e7]
      - generic [ref=e11]:
        - heading "Bem-vindo de volta" [level=4] [ref=e12]
        - paragraph [ref=e13]: Entre com suas credenciais para continuar
    - generic [ref=e14]:
      - generic [ref=e15]:
        - generic [ref=e16]:
          - generic [ref=e17]: E-mail
          - generic [ref=e18]:
            - img [ref=e19]
            - textbox "E-mail" [ref=e22]:
              - /placeholder: seu@email.com
              - text: admin@example.com
        - generic [ref=e23]:
          - generic [ref=e24]: Senha
          - generic [ref=e25]:
            - img [ref=e26]
            - textbox "Senha" [ref=e29]:
              - /placeholder: ••••••••
              - text: admin123
        - button "Entrando..." [disabled]
      - generic [ref=e30]:
        - text: Não tem uma conta?
        - link "Cadastre-se" [ref=e31] [cursor=pointer]:
          - /url: /register
  - region "Notifications alt+T"
```