import 'package:flutter_test/flutter_test.dart';
import 'package:syncjam_frontend/main.dart';

void main() {
  testWidgets('home screen renders', (tester) async {
    await tester.pumpWidget(const SyncJamApp());
    expect(find.text('SyncJam'), findsOneWidget);
  });
}
