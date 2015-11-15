module Authentication
  extend ActiveSupport::Concern

  included do
    before_action :ensure_authenticated_user
  end

  private

  def ensure_authenticated_user
    authenticate_user(cookies.signed[:user]) || redirect_to(users_path)
  end

  def authenticate_user(user_id)
    if (authenticated_user = User.find_by(id: user_id))
      cookies.signed[:user] ||= user_id
      @current_user = authenticated_user
    end
  end

  def unauthenticate_user
    ActionCable.server.disconnect(current_user: @current_user)
    @current_user = nil
    cookies.delete(:user)
  end
end
