class User < ActiveRecord::Base
  has_many :matches
end
