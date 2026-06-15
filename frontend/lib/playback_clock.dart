class PlaybackClock {
  final double offsetMs;

  const PlaybackClock({required this.offsetMs});

  DateTime convertServerTimeToLocal(int serverTime) {
    return DateTime.fromMillisecondsSinceEpoch(serverTime + offsetMs.toInt());
  }

  double get healthScore => 100 - offsetMs.abs();
}
