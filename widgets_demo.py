from IPython.display import display

class Fasta:
    def __init__(self, data):
        self.data = data
    def _ipython_display_(self):
        bundle = {
            'application/vnd.fasta.fasta': self.data,
            'text/plain': self.data
        }
        display(bundle, raw=True)