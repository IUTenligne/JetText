class UserMailer < ApplicationMailer
 
  def welcome_message(user)
    @user = user
    @url  = 'http://jettext.iutenligne.net'
    mail(to: @user.email, subject: 'Bienvenue dans JetText !')
  end

  def validation_message(user)
    @user = user
    @url  = 'http://jettext.iutenligne.net'
    mail(to: @user.email, subject: 'Votre compte JetText')
  end

  def container_update_message(container)
    @container = container
    @user = container.user
    @url  = 'http://jettext.iutenligne.net'
    mail(to: @user.email, subject: 'JetText : mise à jour de ressource')
  end

end