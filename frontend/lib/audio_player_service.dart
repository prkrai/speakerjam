import 'dart:async';

class AudioPlayerService {
  bool _isReady = false;
  double _position = 0.0;

  Future<void> preload(String url) async {
    _isReady = true;
    await Future<void>.delayed(const Duration(milliseconds: 50));
  }

  Future<void> play() async {
    await Future<void>.delayed(const Duration(milliseconds: 20));
  }

  Future<void> pause() async {}

  Future<void> stop() async {}

  Future<void> seek(double position) async {
    _position = position;
  }

  double currentPosition() => _position;

  bool get isReady => _isReady;
}
