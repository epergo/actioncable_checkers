# app/channels/matches_channel.rb
class MatchesChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'matches'
  end
end
