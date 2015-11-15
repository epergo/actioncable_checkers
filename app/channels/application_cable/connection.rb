# app/channels/application_cable/connection.rb
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      puts "connect"
      self.current_user = find_verified_user
    end

    protected

    def find_verified_user
      if (verified_user = User.find(cookies.signed[:user]))
        puts "verified"
        verified_user
      else
        puts "rejected"
        reject_unauthorized_connection
      end
    end
  end
end
