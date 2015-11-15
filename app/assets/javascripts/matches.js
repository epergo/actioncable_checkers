App.matches = App.cable.subscriptions.create('MatchesChannel', {
  received: function(data) {
    console.log(data);
    return $('#matches_list').append(this.renderNewMatch(data));
  },
  renderNewMatch: function(data) {
    var $new_match = $('<tr><td><a class="btn btn-success" href="/matches/' + data.match.id + '">Play this match</a></td><td>Room created by: ' + data.user + '</td>');
    return $new_match;
  }
});