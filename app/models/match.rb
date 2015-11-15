class Match < ActiveRecord::Base
  # Created by this user
  belongs_to :user
  belongs_to :opponent, class_name: 'User', foreign_key: 'opponent_id'

  serialize :board, JSON

  before_create do
    self.turn = user.id
    self.board = '{"status": [
                 [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                 [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                 [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                 [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
                 [2, 0, 2, 0, 2, 0, 2, 0, 2, 0],
                 [0, 2, 0, 2, 0, 2, 0, 2, 0, 2],
                 [2, 0, 2, 0, 2, 0, 2, 0, 2, 0]
                ]}'
  end

  def owner?(user_id)
    self.user_id == user_id
  end

  def turn_of
    if turn == user.id
      user.username
    else
      opponent.username
    end
  end

  def swap_turns
    if turn == user.id
      self.turn = opponent.id
    else
      self.turn = user.id
    end
  end
end
