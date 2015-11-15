class MatchesController < ApplicationController
  before_action :set_match, only: [:show, :edit, :update, :destroy]

  # GET /matches
  # GET /matches.json
  def index
    if params[:user].blank?
      @user = User.find(cookies.signed[:user])
    else
      @user = User.find(params[:user])
      cookies.signed[:user] = @user.id
    end

    @matches = Match.all.includes(:user)

    @your_matches = Match.where('user_id = :user_id or  ', @user.id)
  end

  # GET /matches/1
  # GET /matches/1.json
  def show
    @user = User.find(cookies.signed[:user])
    @match = Match.find(params[:id])
    @board = JSON.parse(@match.board).to_json
    
    @match.update_attribute(:opponent, @user) unless @user.matches.include?(@match)
  end

  # GET /matches/new
  def new
    @match = Match.new
  end

  # GET /matches/1/edit
  def edit
  end

  # POST /matches
  # POST /matches.json
  def create
    @user = User.find(cookies.signed[:user])
    @match = @user.matches.new(match_params)

    if @match.save
      # Send by broadcast the NEW MATCH!!
      ActionCable.server.broadcast('matches', match: @match, user: @user.username)
      redirect_to @match
    else
      render :new
    end
  end

  # PATCH/PUT /matches/1
  # PATCH/PUT /matches/1.json
  def update
    respond_to do |format|
      if @match.update(match_params)
        format.html { redirect_to @match, notice: 'Match was successfully updated.' }
        format.json { render :show, status: :ok, location: @match }
      else
        format.html { render :edit }
        format.json { render json: @match.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /matches/1
  # DELETE /matches/1.json
  def destroy
    @match.destroy
    respond_to do |format|
      format.html { redirect_to matches_url, notice: 'Match was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_match
      @match = Match.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def match_params
      params[:match]
    end
end
