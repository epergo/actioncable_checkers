# app/channels/game_rooms_channel.rb
class GameRoomsChannel < ApplicationCable::Channel
  def follow(data)
    stop_all_streams
    stream_from "#{channel_name(data)}"

    # Broadcast new user in game room
    ActionCable.server.broadcast(channel_name(data), what: 'new_user',
                                                     user: data['user'])
  end

  def unfollow
    stop_all_streams
  end

  def send_move(data)
    # Update match and broadcast data
    match = Match.find(data['game_room_id'])
    board_json = { status: data['game_board'] }
    match.board = board_json.to_json
    match.swap_turns
    match.save

    ActionCable.server.broadcast(channel_name(data), what: 'update_data',
                                                     turn: match.turn,
                                                     turn_n: match.turn_of,
                                                     board: match.board)
  end

  private

  def channel_name(data)
    "game_room_#{data['game_room_id'].to_i}"
  end
end
