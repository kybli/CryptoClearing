import time

class StockExchange:
    def __init__(self):
        self.order_book = []
        self.trade_history = []

    def place_order(self, user, action, symbol, price, quantity):
        order = {
            'user': user,
            'action': action,
            'symbol': symbol,
            'price': price,
            'quantity': quantity,
            'timestamp': time.time()
        }
        self.order_book.append(order)
        self.match_orders(order)

    def match_orders(self, current_order):
        opposite_action = 'sell' if current_order['action'] == 'buy' else 'buy'
        matching_orders = [order for order in self.order_book
                           if order['symbol'] == current_order['symbol']
                           and order['action'] == opposite_action
                           and order['price'] <= current_order['price']]

        for matching_order in matching_orders:
            if matching_order['quantity'] == current_order['quantity']:
                self.execute_trade(matching_order, current_order)
                break
            elif matching_order['quantity'] < current_order['quantity']:
                self.execute_trade(matching_order, current_order)
                current_order['quantity'] -= matching_order['quantity']
            else:
                self.execute_trade(current_order, matching_order)
                matching_order['quantity'] -= current_order['quantity']
                break

        self.order_book = [order for order in self.order_book if order['quantity'] > 0]

    def execute_trade(self, order1, order2):
        trade = {
            'buyer': order2['user'] if order2['action'] == 'buy' else order1['user'],
            'seller': order1['user'] if order1['action'] == 'sell' else order2['user'],
            'symbol': order1['symbol'],
            'price': order1['price'],
            'quantity': min(order1['quantity'], order2['quantity']),
            'timestamp': time.time()
        }
        self.trade_history.append(trade)
        print(f"Trade executed: {trade}")

    def get_trade_history(self):
        return self.trade_history

if __name__ == "__main__":
    exchange = StockExchange()

    exchange.place_order('User1', 'buy', 'AAPL', 150, 10)
    exchange.place_order('User2', 'sell', 'AAPL', 150, 5)
    exchange.place_order('User3', 'sell', 'AAPL', 160, 8)
    exchange.place_order('User4', 'buy', 'AAPL', 160, 7)

    print("Trade History:")
    print(exchange.get_trade_history())